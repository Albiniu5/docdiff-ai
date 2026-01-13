# 📈 Google Integration Guide

Follow these steps to get **Compare Docs AI** indexed by Google and approved for ads.

---

## Part 1: Google Search Console (SEO)
This tells Google your site exists so people can find it.

1.  **Go to** [Google Search Console](https://search.google.com/search-console).
2.  **Add Property** -> Select **"Domain"** (on the left).
3.  Enter: `comparedocsai.com`.
4.  Copy the **TXT record** it gives you.
    *   *(You did this part already! If confirmed, skip to step 6).*
5.  **Status**: If not verified yet, click **Verify**.
6.  **Submit Sitemap**:
    *   In the left menu, click **Sitemaps**.
    *   Enter `sitemap.xml` in the box.
    *   Click **Submit**.
    *   *Result*: It should say "Success". This tells Google about all your pages immediately.

---

## Part 2: Google AdSense (Monetization)
This applies for ads to start earning money.

1.  **Go to** [Google AdSense](https://adsense.google.com/).
2.  Click **Get Started**.
3.  **Your Site**: `https://comparedocsai.com`.
4.  **Get Code**:
    *   AdSense will give you a code snippet that looks like:
        ```html
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
        ```
    *   **Action**: Copy this code.
    *   **Send it to me** here in the chat. I need to paste it into the `<head>` of your website.
5.  **Review**:
    *   Once I add the code, go back to AdSense and check the box "I've placed the code".
    *   Click **Request Review**.
    *   *Note*: Approval takes 3-14 days.

---

## Part 3: Google Analytics (Optional but Recommended)
See how many people visit your site.

1.  Go to [Google Analytics](https://analytics.google.com/).
2.  Create an account for `Compare Docs AI`.
3.  It will give you a **Measurement ID** (starts with `G-XXXXXX`).
4.  Send me that ID, and I will add the tracking code.
