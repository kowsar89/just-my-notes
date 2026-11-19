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

**A caution about password storage:** Without an enabled and working OS keyring, `glab config set client_cert_password` can store the `.p12` password in plaintext in `~/.config/glab-cli/config.yml`.
## Part 4: Testing GitLab API Access

With the certificate and password configured, I checked my GitLab API access:

```bash
glab api user --hostname gitlab.example.com
```

This should return my GitLab user information if the connection and GitLab authentication work. A successful response alone does not confirm that the server requires mTLS; that depends on the server's TLS configuration.

## Final Thoughts

My `.p12` file is stored at:

```text
~/.config/glab-cli/certs/client.p12
```

I configured `glab` to use it for my GitLab host, along with the certificate password. The settings persist, so I don't need to select the certificate or re-enter its password for every API request.

I chose a straightforward setup without a keyring, with the important tradeoff that the saved certificate password may be readable as plaintext in the local `glab` configuration file.

The relevant settings are covered in the [GitLab CLI connection guide](https://docs.gitlab.com/cli/connection/) and [configuration reference](https://docs.gitlab.com/cli/configuration/).
