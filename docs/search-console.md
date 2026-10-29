# Google Search Console: steps for Juwan

Verify ridewithhr.com, submit the sitemap and ask Google to index the pages. Written 25 Oct 2026. About 20 minutes of work, plus waiting for DNS.

> **This file is public** (the repository is on GitHub). Don't paste the verification string or any codes into it.

Do these steps **after** the SEO changes are live, so Google sees the final titles, descriptions and clean URLs. Before you start, check these load: `https://ridewithhr.com/sitemap.xml` and `https://ridewithhr.com/airport-transfers`, and that `https://ridewithhr.com/CLAUDE.md` shows "page not found".

Sign in to Search Console with the Google account that should own it (the same account used for Analytics and Ads is the simplest).

---

## 1. Verify the domain (DNS TXT record at Namecheap)

A **Domain property** covers `ridewithhr.com`, `www`, `app.ridewithhr.com` and both `http` and `https` in one go.

1. Go to **search.google.com/search-console** and choose **Add property**.
2. Pick **Domain** (the left box), type `ridewithhr.com`, then **Continue**.
3. Google shows a **TXT record** that starts with `google-site-verification=`. Click **Copy**. Keep this tab open.
4. In another tab, sign in to **Namecheap** → **Domain List** → **Manage** next to ridewithhr.com → **Advanced DNS**.
5. Under **Host Records** click **Add New Record** and fill in:
   - **Type:** TXT Record
   - **Host:** `@`
   - **Value:** paste the whole string you copied
   - **TTL:** Automatic
6. Click the **tick** to save it. Don't change or delete the existing records (the website's A and CNAME records and the `app` record for the booking app stay as they are).
7. Back in Search Console click **Verify**. If it says the record isn't found yet, wait 10 to 30 minutes and try again. It can take a few hours, rarely up to a day.

If the domain uses nameservers other than Namecheap's, add the TXT record wherever the domain's DNS is managed.

**Faster fallback (only once the Google tag is live on the site):** choose **URL prefix** instead, enter `https://ridewithhr.com/`, and pick the **Google Analytics** or **Google Tag** method. It verifies straight away if you are signed in with the account that owns the tag. You can later add the Domain property as well.

Leave the TXT record in place permanently; deleting it un-verifies the property.

---

## 2. Submit the sitemap

1. In the left menu open **Indexing → Sitemaps**.
2. Under **Add a new sitemap** type `sitemap.xml` and click **Submit**.
3. Status should change to **Success**, with **8 discovered pages**. "Couldn't fetch" for the first minutes is normal; refresh later.

The sitemap lists exactly these pages (clean URLs, no `.html`):

| Page | URL |
|---|---|
| Home | https://ridewithhr.com/ |
| Services | https://ridewithhr.com/services |
| Airport transfers | https://ridewithhr.com/airport-transfers |
| Fleet | https://ridewithhr.com/fleet |
| About | https://ridewithhr.com/about |
| Enquire | https://ridewithhr.com/enquire |
| Privacy | https://ridewithhr.com/privacy |
| Booking terms | https://ridewithhr.com/terms |

---

## 3. Request indexing

1. Paste one page address into the **search bar at the top** of Search Console (this is the **URL Inspection** tool) and press Enter.
2. If it says **URL is not on Google**, click **Test live URL**, wait for the result, then **Request indexing**. If it says **URL is on Google**, you can still use **Request indexing** after a content change.
3. Do the pages in this order, because they matter most for the searches we want: **Home**, **Airport transfers**, **Services**, **Fleet**, **Enquire**, **About**. Privacy and terms can wait for Google to find them.
4. Google limits manual requests to roughly ten a day. One request per page is enough; repeating it does not speed anything up.

Indexing usually takes a few days to a couple of weeks. Rankings take longer, and nobody can promise a position.

---

## 4. Check that everything is understood

Do these once the pages show as indexed (or a week later):

- **Indexing → Pages:** all eight pages should be "Indexed". "Excluded" reasons to look at: *Duplicate without user-selected canonical* or *Alternate page with proper canonical tag* for any `.html` address is expected and fine.
- **Enhancements:** a **Breadcrumbs** report should appear for the inner pages. Open it and confirm there are no errors.
- **Rich Results Test** (search.google.com/test/rich-results): enter the home page address. It should detect a local business ("Local business") with the name, phone and email matching the Google Business Profile.
- **Settings → Crawl stats** later shows whether Google can reach the site without errors.
- **Removals** (only if needed): if `/CLAUDE.md` or `/README.md` ever appeared in Google, use **Indexing → Removals → New request → Temporarily remove URL**, after you have confirmed they now return "page not found".

---

## 5. Set up for the longer term

- **Add Renee as a user:** **Settings → Users and permissions → Add user**, her email, permission **Full** (or **Owner** if you want her to be able to remove you). She keeps her own Google sign-in.
- **Link Search Console to Google Analytics 4:** in GA4, **Admin → Product links → Search Console links → Link**, choose this property. Then the search terms people used appear next to site behaviour.
- **Check `www`:** open `https://www.ridewithhr.com`. It should land on `https://ridewithhr.com/`. If it doesn't load, add a `CNAME` record `www` pointing to the GitHub Pages address, then check that GitHub Pages' *Enforce HTTPS* is still ticked.
- **Look monthly** at **Performance → Search results**: the queries ("Barbados chauffeur", "airport transfer Barbados", "BGI airport pickup", "private driver Barbados", "wedding car Barbados", "island tour Barbados"), clicks and average position. Position changes slowly; judge over weeks.

---

## If something goes wrong

| Problem | What to do |
|---|---|
| "Verification failed" | The TXT record may not have spread yet, or it was pasted with spaces or quotes. Check that Host is `@` and the whole value starts `google-site-verification=`. Wait and try again. |
| Sitemap "Couldn't fetch" | Open `https://ridewithhr.com/sitemap.xml` in a browser. If it loads, wait and resubmit. If not, the site needs redeploying. |
| A page shows "Crawled, currently not indexed" | Normal for a new site. Make sure the page is linked from the footer, then wait a week before asking again. |
| A page shows "Page with redirect" | It is probably an old `.html` address; ignore it as long as the clean address is indexed. |
