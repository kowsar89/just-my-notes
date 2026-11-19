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

I needed to use a password-protected TLS client certificate to access a self-managed GitLab instance through GitLab CLI (`glab`) on Ubuntu.

My certificate was provided as a `.p12` (PKCS#12) file. I wanted `glab` to use it for HTTPS API requests without extracting the certificate and private key into separate files.

I used `glab` 1.131.0 for this setup.

## Part 1: Storing the .p12 Certificate

A `.p12` file typically contains a client certificate and its private key, protected by a password. I decided to keep it under my user configuration directory, outside any Git repositories.

### Step 1: Create the Certificate Directory

I created a directory for the certificate:

```bash
mkdir -p ~/.config/glab-cli/certs
```

### Step 2: Place the Certificate in the Directory

I copied the `.p12` file into that directory and named it `client.p12`.

The resulting structure was:

```text
~/.config/glab-cli/
├── config.yml
└── certs/
    └── client.p12
```

The certificate file had `600` permissions, so only my user could read or modify it. Keeping a PKCS#12 file private matters because it usually includes the private key.

## Part 2: Configuring glab to Use the Certificate

I configured the certificate for my self-managed GitLab hostname.

### Step 1: Set the Client Certificate

I ran:

```bash
glab config set --host gitlab.example.com \
  client_cert "$HOME/.config/glab-cli/certs/client.p12"
```

Here, `gitlab.example.com` stands for the actual GitLab hostname.

The `client_cert` setting points directly to my `.p12` file. I didn't need to convert it to PEM or set a separate `client_key` path.

Once configured, the certificate path stays in the `glab` configuration across terminal sessions and reboots.

## Part 3: Saving the .p12 Password

Because the `.p12` file was password-protected, `glab` also needed the password to unlock it.

I entered the password without displaying it on the terminal, then saved it through the `glab` configuration command:

```bash
read -rsp "Enter P12 password: " P12_PASSWORD
echo

glab config set --host gitlab.example.com \
  client_cert_password "$P12_PASSWORD"

unset P12_PASSWORD
```

The `read -s` option hides the password while typing it. Using a variable also keeps the password itself out of the command recorded in shell history.

The `unset` command removes the `P12_PASSWORD` shell variable after the configuration command finishes. It **does not** remove the password already saved by `glab`.

**A caution about password storage:** Without an enabled and working OS keyring, `glab config set client_cert_password` can store the `.p12` password in plaintext in `~/.config/glab-cli/config.yml`. This is how I chose to configure it, so I keep the configuration file private and do not commit or share it. Anyone who can read that file may be able to obtain the password. A keyring is a more secure alternative for supported credentials.

## Part 4: Checking GitLab API Access

I already had GitLab account authentication configured. The TLS client certificate is separate from my GitLab access token: the certificate is used for the HTTPS connection, while the token authorizes GitLab API requests.

### Step 1: Check glab Authentication

I ran:

```bash
glab auth status --hostname gitlab.example.com
```

This shows the account, Git protocol, API endpoint, and token storage information for that GitLab host.

A successful authentication status does not by itself prove that the TLS client certificate was presented.

### Step 2: Test an API Request

To check API access, I can run:

```bash
glab api user --hostname gitlab.example.com
```

If the server is reachable and my GitLab account credentials are valid, this should return my user information.

A successful API response alone also does not prove that mTLS is enforced. The server or reverse proxy must actually request and validate a client certificate for the connection to test that requirement.

## Troubleshooting

If `glab` cannot open the certificate, I check that the file exists at the configured location and that my user has permission to read it:

```bash
ls -l ~/.config/glab-cli/certs/client.p12
```

If the PKCS#12 file cannot be decrypted, I check the password saved through `client_cert_password`, without printing or sharing it.

If the GitLab API returns `401 Unauthorized` or `403 Forbidden`, I check my GitLab token and permissions separately. Those HTTP errors do not necessarily mean the TLS certificate is incorrect.

## Final Thoughts

My `.p12` file is stored at:

```text
~/.config/glab-cli/certs/client.p12
```

I configured `glab` to use it for my GitLab host, along with the certificate password. The settings persist, so I don't need to select the certificate or re-enter its password for every API request.

I chose a straightforward setup without a keyring, with the important tradeoff that the saved certificate password may be readable as plaintext in the local `glab` configuration file.

The relevant settings are covered in the [GitLab CLI connection guide](https://docs.gitlab.com/cli/connection/) and [configuration reference](https://docs.gitlab.com/cli/configuration/).
