# H&R Executive Services website (ridewithhr.com)

Premium, mobile-first website for **H&R Executive Services**, a private transport business in Barbados. The business name is the one in its logo (confirmed 17 Oct 2026). `ridewithhr.com` is the web address only.

## Local preview

No build step or package installation is required. Serve the repository root with any static web server, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Editing content

- Business contact, domain, booking mode and fleet records: `assets/js/content.js`
- Home page: `index.html`
- Dedicated content pages: `services.html`, `fleet.html`, `about.html`, `enquire.html`, `privacy.html`, `terms.html` (privacy and booking terms are drafts: see CLAUDE.md)
- Original layout CSS: `assets/css/styles.css`; the new ivory / charcoal / champagne design, Cormorant Garamond + Manrope, responsive enhancements and fleet presentation: `assets/css/luxury-refresh.css` (loaded after the original on every page)
- Navigation, form and animation behavior: `assets/js/app.js`

The booking form is in **WhatsApp mode** (`booking.mode: "whatsapp"` in `assets/js/content.js`). After validation it opens WhatsApp, a chat with the business number (`business.whatsapp`, digits only), with the enquiry typed in; the customer presses send. Nothing is stored on the website and no payment is taken. Other modes: `email` (opens a pre-filled email to `business.email`) and `preview` (copyable summary only).

The business number (+1 246 231 2679, WhatsApp and calls) is also hard-coded in every page's footer (call and WhatsApp links), the floating WhatsApp button and the call line on `enquire.html`; change all of them together.

## October 15, 2026 design update

- The `main` branch includes the premium light design with selected charcoal feature panels, dark footer, refreshed vehicle cards, and a new homepage service promise section.
- White vehicle model references are used for the BMW iX, BMW i5, EQE sedan and Range Rover via Wikimedia Commons `Special:FilePath` links. EQS SUV, EQE SUV and Toyota Hiace continue using locally held white-vehicle references. **All seven are illustrative model photos, not client fleet photographs.**
- Wikimedia Commons links are intentionally external. Download appropriately licensed/approved final images to the local assets folder before launch to eliminate third-party network dependence, retaining license credits.
- Update all pages' `luxury-refresh.css?v=1` cache key together after future style changes.
- Confirm whether the site at `technovabb.com/ridewithhr-website/` automatically syncs from this repository. GitHub commits alone do **not** establish that deployment; if the folder is uploaded manually, it needs a separate publish step.
- Follow up for complete client fleet photography and approved commercial/terms details. Do not imply online payment or confirmed partner-vehicle availability.

## Deployment

The site is compatible with GitHub Pages because it is a static site with relative asset paths. GitHub Pages can publish directly from the repository's `main` branch and root folder.

Before connecting the final domain:

1. Confirm that `ridewithhr.com` has been purchased and decide which account controls DNS.
2. Add the final URL to `business.website` in `assets/js/content.js`.
3. Add canonical and Open Graph URL metadata to every HTML page.
4. Add a `CNAME` file only after DNS ownership is confirmed.
5. Generate `sitemap.xml` with the final production URL and update `robots.txt`.

## Client information still required

- Confirm which proposal-listed vehicles are company-owned, partner-supplied or examples only
- Exact trims, colours, passenger/luggage capacity and live availability for every active vehicle
- Original fleet photographs or approvals for final licensed reference imagery
- Booking email (phone/WhatsApp +1 246 231 2679 received 14 Oct 2026)
- Payment provider and whether payment means deposit, full prepayment or pay-by-link
- Confirmed domain ownership and DNS access
- Public business address/service hours, if the client wants them displayed
- Cancellation, privacy and booking terms

## Scope guardrail

This repository stays within the agreed basic marketing-site scope. A custom booking engine, live availability, dispatch portal, customer accounts, automated pricing, payment processing, driver management, or a full CMS should be separately scoped before being promised or implemented.

## Image licence

### Fleet page images (October 2026)

The Fleet page (`fleet.html`), the home page's "Our own fleet" section (`mercedes-eqs-suv.webp`) and every page's link preview use seven local 1600×1000 WebP studio images in `assets/images/fleet/`: `mercedes-eqs-suv.webp`, `mercedes-eqe-suv.webp` (also the featured image), `bmw-ix.webp`, `bmw-i5.webp`, `mercedes-eqe-saloon.webp`, `range-rover-sport.webp` and `toyota-hiace.webp`, plus `mercedes-eqs-suv-share.jpg` (1200×630) for link previews. Juwan Prescod (Tech Nova) supplied them on 17 Oct 2026. They are **illustrative model references**, not photographs of the H&R Executive Services fleet. The page says so in three places: a label on each image, the gallery introduction and the footer ("exact vehicle confirmed when booking"). Replace them with the client's own photos when supplied, starting with her white EQS SUV and EQE SUV.

### Older Wikimedia vehicle photos (not shown on the site)

Since 17 Oct 2026 no page displays the photos below. They stay in `assets/images/fleet/*.jpg` (plus `eqe-suv.jpg`) only as backups, so their credits are kept here. If one is ever shown again, put its credit back in that page's footer. They are **reference images** of the models, sourced from Wikimedia Commons and resized/cropped for display. They do **not** depict H&R Executive Services' actual vehicles; replace them with the client's own photos when supplied. Adapted CC BY-SA files are shared under the same licence.

- **Mercedes-Benz EQS SUV** (`fleet/eqs-suv.jpg`): Harvey Bold, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Source: <https://commons.wikimedia.org/wiki/File:2023_Mercedes-Benz_EQS_450_Business_Class_4Matic_-_108kWh_(360PS)_Electric_-_Diamond_White_-_02-2024,_Front.jpg>
- **Mercedes-Benz EQE SUV** (`eqe-suv.jpg`): Chelentano, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source: <https://commons.wikimedia.org/wiki/File:Eqe-suv.jpg>
- **BMW iX** (`fleet/bmw-ix.jpg`): Damian B Oh, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source: <https://commons.wikimedia.org/wiki/File:BMW_I20_iX_xDrive40_Sport_Aventurin_Red_Metallic_(19).jpg>
- **BMW i5** (`fleet/bmw-i5.jpg`): Tokumeigakarinoaoshima, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source: <https://commons.wikimedia.org/wiki/File:BMW_i5_eDrive40_M_Sport_(G60)_front.jpg>
- **Mercedes-Benz EQE saloon** (`fleet/eqe-saloon.jpg`): Alexander Migl, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source: <https://commons.wikimedia.org/wiki/File:Mercedes-AMG_EQE_43_(V295)_1X7A6059.jpg>
- **Range Rover Sport** (`fleet/range-rover-sport.jpg`): Tokumeigakarinoaoshima, CC0 (public domain). Source: <https://commons.wikimedia.org/wiki/File:Land_Rover_RANGE_ROVER_SPORT_DYNAMIC_HSE_D300_(L461)_front.jpg>
- **Toyota Hiace** (`fleet/toyota-hiace.jpg`): Ethan Llamas, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source: <https://commons.wikimedia.org/wiki/File:2023_Toyota_Hiace_2.8_Super_Grandia_in_Platinum_White_Pearl_Mica,_front_right.jpg>