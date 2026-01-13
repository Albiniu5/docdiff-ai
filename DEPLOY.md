# 🚀 Deployment Guide: Hetzner VPS + Coolify

This guide will walk you through setting up your own "mini-cloud" on Hetzner using Coolify. This is the most cost-effective way to host **DocDiff AI** and any future apps you build.

---

## Phase 1: Get the Server (Hetzner)

1.  **Log in/Sign up** at [Hetzner Cloud Console](https://console.hetzner.cloud/).
2.  Create a **New Project** (e.g., "MyApps").
3.  Click **"Add Server"**.
4.  **Location**: Choose one close to your users (e.g., Falkenstein or Ashburn, VA).
5.  **Image**: Choose **Ubuntu 24.04** (or 22.04).
6.  **Type**: **Shared vCPU**.
    *   Select **CPX11** (Approx €5/month). This is plenty for starting.
7.  **SSH Key**: (Optional but recommended) Upload your computer's public key. If you don't know how, just select **Password** (they will email you the root password).
8.  **Name**: Give it a name like `coolify-host`.
9.  Click **Create & Buy Now**.

---

## Phase 2: Install Coolify

1.  Open your terminal (PowerShell or Command Prompt on Windows).
2.  Connect to your new server:
    ```powershell
    ssh root@<YOUR_SERVER_IP_ADDRESS>
    ```
    *(If you used a password, it will ask for it. Note: you won't see characters while typing).*

3.  Once logged in, run this **single command** to install everything (it takes ~5 mins):
    ```bash
    curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
    ```

4.  Wait until it says `Coolify installed successfully!`. Then access it at `http://<YOUR_IP>:8000`.

---

## Phase 3: Deploy DocDiff AI

1.  Open your browser and go to `http://<YOUR_SERVER_IP>:8000`.
2.  **Sign up** (this creates the admin account for your private Coolify instance).
3.  On the dashboard, click **+ New Resource**.
4.  Select **Git Repository** -> **Public Repository**.
    *   (Since your repo is public, this is easiest. If private, you'd add a GitHub App key first).
5.  Paste your URL: `https://github.com/Albiniu5/docdiff-ai`
6.  Click **Check Repository**.
7.  Coolify will auto-detect the `Dockerfile` we created.
8.  **Configuration**:
    *   **Name**: `docdiff-ai`
    *   **Domain**: (Leave empty for now, or put `http://<YOUR_IP>`)
9.  **Environment Variables**:
    You MUST add your keys here. Go to the **Environment Variables** tab and add:
    *   `GEMINI_API_KEY` = `...`
    *   `GROQ_API_KEY` = `...`
    *   `MISTRAL_API_KEY` = `...`
    *   `DEEPSEEK_API_KEY` = `...`
    *   `SENTRY_DSN` = `...` (if you have one)
    *   `FLASK_ENV` = `production`
10. Click **Deploy**.

---

## Phase 4: Pointing Your Domain (DNS)

Once you buy your `.com` domain (e.g., `DocDiffAI.com`):

1.  Go to your Domain Registrar (GoDaddy/Namecheap/Cloudflare).
2.  Find **DNS Settings**.
3.  Create an **A Record**:
    *   **Name**: `@` (or blank)
    *   **Value**: `<YOUR_HETZNER_IP_ADDRESS>`
4.  Back in **Coolify**:
    *   Go to your `docdiff-ai` resource.
    *   Change **Domains** to `https://docdiffai.com` (or whatever you bought).
    *   Click **Save**. Coolify will automatically provision an SSL certificate (https) for you.

---

### Troubleshooting
*   **Logs**: In Coolify, click the "Logs" tab to see if the app started correctly.
*   **Build Failures**: Check the "Build Logs". Usually it's a missing dependency.
