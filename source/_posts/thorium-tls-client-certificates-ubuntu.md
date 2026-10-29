---
title: How I Configured TLS Client Certificates in Thorium Browser on Ubuntu
date: 2026-10-29
categories:
  - Software
tags:
  - Linux
  - Thorium
  - TLS
---

I needed to use TLS client certificates to access a couple of work-related websites in Thorium Browser on Ubuntu. The certificates were provided as password-protected `.p12` files.

I first imported the certificates through Thorium's GUI and later configured automatic certificate selection using a Chromium policy.

## Part 1: Importing .p12 Certificates into Thorium

### Step 1: Open Certificate Settings

I opened Thorium and navigated to:

```text
chrome://settings/certificates
```

Under **Your certificates** (the personal certificates section), I found the option to import a certificate.

### Step 2: Import the .p12 File

I clicked **Import**, selected the `.p12` file, and entered the password provided with it.

A `.p12` (PKCS#12) file typically contains both the certificate and its private key, protected by a password.

I repeated the process for the other certificate.

After importing, the certificates were available for TLS client authentication, and I could access the websites by selecting the appropriate certificate when prompted.

---

## Part 2: Automatically Selecting TLS Certificates in Thorium

Although the certificates worked, Thorium kept asking me to select a certificate every time I visited those websites.

I wanted Thorium to select them automatically, without showing the certificate selection dialog each time.

Chromium-based browsers support a policy called `AutoSelectCertificateForUrls` for this.

### Step 1: Create the Policy Directory

My Thorium installation was from a `.deb` package on Ubuntu. I used the following Chromium policy directory, which also works with my Thorium installation:

```bash
sudo mkdir -p /etc/chromium/policies/managed
```

### Step 2: Add the Certificate Selection Policy

I created a JSON policy file:

```bash
sudo nano /etc/chromium/policies/managed/client-cert.json
```

Then added:

```json
{
  "AutoSelectCertificateForUrls": [
    "{\"pattern\":\"https://example1.com\",\"filter\":{}}",
    "{\"pattern\":\"https://example2.com\",\"filter\":{}}"
  ]
}
```

These are the two websites I needed automatic certificate selection for.

The important part here is `"filter": {}`. This tells Thorium to automatically select an eligible certificate without filtering by a specific issuer or subject.

The website's TLS requirements still determine which certificates are eligible. If multiple certificates qualify, Thorium may select one other than the intended certificate. In that case, an `ISSUER` or `SUBJECT` filter can be used instead.

After adding the configuration, I saved the file and exited nano.

### Step 3: Reload the Policy

I opened the following URL in Thorium:

```text
chrome://policy
```

Then clicked **Reload policies**.

The `AutoSelectCertificateForUrls` policy appeared with status **OK**, along with the configured website patterns.

### Step 4: Verify

After applying the policy, I visited the websites again.

This time, Thorium automatically selected the appropriate TLS client certificate without showing the selection dialog.

No browser extensions or additional scripts were needed.

## How Thorium Knows Which Certificate to Select

The policy doesn't explicitly map a website to a particular certificate.

During the TLS handshake, the website requests a client certificate and may specify acceptable certificate authorities and other requirements.

Thorium checks the available certificates against these requirements and selects an eligible one according to the policy.

This is why the empty `"filter": {}` worked in my case, even with multiple certificates installed.

## Final Thoughts

The `.p12` import was straightforward using Thorium's GUI. The only additional configuration I needed was the `AutoSelectCertificateForUrls` policy to avoid repeatedly selecting certificates.

The policy file is stored at:

```text
/etc/chromium/policies/managed/client-cert.json
```

This location worked with my `.deb` installation of Thorium on Ubuntu. Other builds may use a different policy directory.