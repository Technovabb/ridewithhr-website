# Ride With HR website

Premium, mobile-first website for **H&R Transport**, branded as **Ride With HR**.

## Local preview

No build step or package installation is required. Serve the repository root with any static web server, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Editing content

- Business contact, domain, booking mode and fleet records: `assets/js/content.js`
- Home page: `index.html`
- Dedicated content pages: `services.html`, `fleet.html`, `about.html`, `enquire.html`
- Visual design and responsive layout: `assets/css/styles.css`
- Navigation, form and animation behavior: `assets/js/app.js`

The current booking form is deliberately in **preview mode**. It validates the enquiry and creates a copyable summary, but it does not transmit data or take payment. Once the client supplies a public booking email, add it in `assets/js/content.js` and change `booking.mode` from `preview` to `email`.

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
- Booking/enquiry destination email and public phone/WhatsApp number
- Payment provider and whether payment means deposit, full prepayment or pay-by-link
- Confirmed domain ownership and DNS access
- Public business address/service hours, if the client wants them displayed
- Cancellation, privacy and booking terms

## Scope guardrail

This repository stays within the agreed basic marketing-site scope. A custom booking engine, live availability, dispatch portal, customer accounts, automated pricing, payment processing, driver management, or a full CMS should be separately scoped before being promised or implemented.

## Image licence

The Mercedes-Benz EQE SUV reference photo is by Chelentano, sourced from Wikimedia Commons under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). It is cropped for display and does **not** depict H&R Transport's actual vehicle.

Source: <https://commons.wikimedia.org/wiki/File:Eqe-suv.jpg>
