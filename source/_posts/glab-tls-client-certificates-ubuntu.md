---
title: How I Configured GitLab CLI with TLS Client Certificates on Ubuntu
date: 2026-11-19
categories:
  - Software
tags:
  - Linux
  - GitLab
  - glab
  - TLS
---

I needed to use a password-protected TLS client certificate to access a self-managed GitLab instance from the command line on Ubuntu.

I was already using a `.p12` (PKCS#12) certificate with a Chromium-based browser, but I also wanted GitLab CLI (`glab`) to present the certificate automatically when making HTTPS API requests.

I used `glab` 1.131.0. The configuration below focuses on mutual TLS (mTLS), not on setting up GitLab personal access tokens or Git operations.

## Part 1: Storing the .p12 Certificate

A `.p12` file can hold both the client certificate and its private key. Because it contains sensitive key material, I wanted to keep the file in a predictable location outside my Git repositories.

### Step 1: Create a Directory

I created a directory under my user configuration:

```bash
mkdir -p ~/.config/glab-cli/certs
chmod 700 ~/.config/glab-cli/certs
```

### Step 2: Copy the Certificate

I copied my certificate into that directory:

```bash
cp /path/to/original.p12 ~/.config/glab-cli/certs/client.p12
chmod 600 ~/.config/glab-cli/certs/client.p12
```

This resulted in the following layout:

```text
~/.config/glab-cli/
├── config.yml
└── certs/
    └── client.p12
```

The directory permissions restrict access to my user, while `600` restricts reading and writing the certificate file to my user. These permissions do not replace the certificate's own password protection.

## Part 2: Configuring glab to Use the Certificate

Unlike Chromium-based browsers, `glab` does not use the browser's certificate selection policy. Instead, I configured a certificate path for the GitLab host.

### Step 1: Set the Client Certificate

I ran:

```bash
glab config set --host gitlab.example.com \
  client_cert "$HOME/.config/glab-cli/certs/client.p12"
```

The host is an example; I replaced it with my GitLab instance's hostname.

With a PKCS#12 bundle, `glab` can read the client certificate and private key from the same file. I did **not** configure `client_key`, which is intended for a separate private-key file.

I also made sure the API protocol was HTTPS:

```bash
glab config set --host gitlab.example.com api_protocol https
```

### Step 2: Verify the Saved Path

I checked the setting:

```bash
glab config get client_cert --host gitlab.example.com
```

The output should be the absolute path to `client.p12`.

The certificate path is persistent: I don't need to set it again after opening a new terminal or rebooting.

## Part 3: Handling the .p12 Password Without a Keyring

My `.p12` bundle was password-protected. I didn't want to save its decryption password as plaintext in `~/.config/glab-cli/config.yml`, and I chose not to use an operating system keyring.

For that reason, I used an environment variable in the terminal session rather than saving `client_cert_password` with `glab config set`.

### Step 1: Enter the Password

I ran:

```bash
read -rsp "P12 password: " GLAB_CLIENT_CERT_PASSWORD
echo
export GLAB_CLIENT_CERT_PASSWORD
```

The `-s` option prevents the password from being echoed as I type it. Since I enter the value at a prompt, the actual password is not part of my shell command history.

`glab` recognizes `GLAB_CLIENT_CERT_PASSWORD` as the password for a PKCS#12 client certificate.

This does **not** encrypt the environment variable: the password remains in the shell environment and is inherited by child processes until I remove it or close the session. I therefore use this method in my own interactive terminal, not in shared shell sessions or public logs.

### Step 2: Avoid Saving the Password in the Config File

I did not run a command like:

```bash
# Not used in my setup:
# glab config set --host gitlab.example.com client_cert_password "PASSWORD"
```

Without a working keyring, saving that setting can write the password as plaintext into the `glab` configuration file.

The tradeoff of my approach is that I need to enter the certificate password again in each new terminal session. Only the certificate file path is saved permanently.

## Part 4: Testing GitLab API Access

I already had GitLab account authentication configured separately. The TLS client certificate is used during the HTTPS handshake; it does not automatically replace GitLab API authentication.

### Step 1: Check the GitLab Host

I checked the account and endpoint configuration:

```bash
glab auth status --hostname gitlab.example.com
```

This checks `glab` authentication settings, but a successful result alone does not prove that the TLS client certificate was presented to the server.

### Step 2: Make an API Request

With the certificate password present in the shell environment, I tested an API call:

```bash
GITLAB_HOST=gitlab.example.com glab api user
```

A successful response indicates that I could reach the GitLab API with the configured credentials. To confirm that **mTLS specifically** is required and working, the GitLab server or reverse proxy must be configured to request and validate client certificates; an ordinary successful API request does not prove this by itself.

For this setup, I kept `gitlab.com` as my default `glab` host and supplied `GITLAB_HOST` for commands against my self-managed instance.

### Step 3: Remove the Password from the Session

When finished, I ran:

```bash
unset GLAB_CLIENT_CERT_PASSWORD
```

This removes the variable from the current shell. It does not clear copies already inherited by processes that were launched earlier.

## Troubleshooting

If `glab` cannot find the certificate, I first check the path and permissions:

```bash
ls -l ~/.config/glab-cli/certs/client.p12
glab config get client_cert --host gitlab.example.com
```

If the PKCS#12 bundle cannot be decrypted, I check whether `GLAB_CLIENT_CERT_PASSWORD` was exported in the **same terminal session** and whether the entered password is correct. I avoid printing the environment variable's value.

If I get an HTTP `401 Unauthorized` or `403 Forbidden` response, the TLS connection may already be working while GitLab account permissions or API credentials are failing. I troubleshoot those separately from the client certificate.

If the server certificate is signed by a private certificate authority, `glab` also supports a host-specific `ca_cert` setting for trusting that server certificate. I avoid disabling TLS verification just to make a connection succeed.

## Final Thoughts

I now have the client certificate stored permanently at:

```text
~/.config/glab-cli/certs/client.p12
```

And `glab` knows which certificate file to use for my self-managed GitLab hostname.

Unlike the browser configuration, this setup requires no Chromium policy or certificate selection dialog. It also doesn't require extracting a separate PEM key from the `.p12` bundle.

I deliberately didn't store the certificate's password persistently: I enter it when starting a terminal session and remove the environment variable afterwards. This gives me a straightforward, no-keyring setup, with the tradeoff of typing the password again for a new session.

The `glab` options used here are documented in the [GitLab CLI connection guide](https://docs.gitlab.com/cli/connection/) and [configuration reference](https://docs.gitlab.com/cli/configuration/).
