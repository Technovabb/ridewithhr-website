# Claude handoff: H&R Executive Services website (ridewithhr.com)

This is a buildless, multi-page static website. Work directly in `index.html`, `services.html`, `fleet.html`, `about.html`, `enquire.html`, `privacy.html`, `terms.html`, `assets/css/styles.css`, `assets/js/content.js`, and `assets/js/app.js`. Keep the main content areas as separate pages rather than collapsing them into a one-page scrolling site. Do not introduce a framework or package manager unless the owner explicitly requests one.

## Non-negotiable content rules

- The business is **H&R Executive Services**, the name in its logo (Juwan, 17 Oct 2026). `ridewithhr.com` is only the web address (the available domain they chose). Earlier notes called it "H&R Transport" and "Ride With HR"; don't use either name on the site.
- The logo files are in `assets/images/brand/`: the full logo, the dark-background version, the monogram (favicon), and `hr-executive-services-mark.svg` (the logo panel without the tagline, for the header). They are vector reconstructions of the client's logo; don't change the wording, colours or proportions without her approval.
- Do not change the company name for SEO. Use local phrases naturally: Barbados airport transfer, Barbados chauffeur, private driver Barbados, executive transport Barbados, and Grantley Adams airport transfer.
- **No prices on the site** (Juwan, 18 Oct 2026). She prices each journey after the request and sends the price and a payment link herself. Prices stay in the private notes repo only. Payment methods: card, cash and bank transfer.
- Passenger/luggage capacity and her own car photos are **not needed**: she assigns the right vehicle for each request. The "20+ years" collective tourism experience is confirmed accurate (18 Oct 2026).
- Do not invent prices, testimonials, availability, vehicle specifications, business contact details or operating hours.
- The confirmed company-owned fleet models are a **2025 Mercedes-Benz EQE SUV** and a **2025 Mercedes-Benz EQS SUV** (white; confirmed by Juwan on 14 Oct 2026) and a **charcoal BMW i5** (her own car, confirmed by Juwan on 17 Oct 2026; model year not given, so don't state one). The proposal also lists a 2026 BMW iX, 2025 BMW i5, Mercedes-Benz EQE sedan, Range Rover Sport and Toyota Hiace. Juwan (18 Oct 2026): they are hers, but not solely hers, so leave them listed as they are.
- The proposal's Nissan Serena is a **luggage vehicle, not part of the passenger fleet** (Juwan, 14 Oct 2026). Keep it out of the fleet gallery and vehicle lists.
- The home-page hero is a single illustrative backdrop (`assets/images/hero/barbados-luxury-arrival-blank-plate.webp`, mobile `barbados-luxury-arrival-mobile-blank-plate.webp`, set in `luxury-refresh.css`). The earlier fleet slideshow was removed in the October 2026 redesign.
  - The `-blank-plate` versions (17 Oct 2026) are the `-branded` artwork with the old "RIDE WITH HR" number plate painted out. Never put a business name on a car plate; it would present the artwork as her own vehicle.
  - The hero note says it's illustrative campaign artwork; keep that note.
- Fleet page images: since 17 Oct 2026 the Fleet page uses the seven illustrative 1600x1000 WebP studio images Juwan supplied (`assets/images/fleet/*.webp`, listed in the README).
  - Keep their "Illustrative model reference" labels and the footer disclosure.
  - There are two BMW i5 cards. The charcoal one is her own car (company fleet, listed third, after the EQS and EQE SUVs, and in the form's "Our own cars" group). The white one is still a proposal-listed option.
  - The featured EQE SUV image is never cropped. Below 80rem it stacks above the details; from 80rem it sits whole in the side column. The rules are in the "Fleet artwork" block of `luxury-refresh.css`.
  - Clicking any fleet image opens a larger viewer (Juwan, 17 Oct 2026). It's built by `app.js` from the gallery figures and styled under "Fleet image viewer" in `luxury-refresh.css`.
    - Arrows, keys and swipe move between cars. Esc, the close button or a click outside closes it.
    - The viewer caption keeps the "Illustrative model reference" note and the "Request this vehicle" link.
- The home page's "Our own fleet" image and every page's link preview also use the studio EQS SUV image (`mercedes-eqs-suv.webp`, `mercedes-eqs-suv-share.jpg`). The older Wikimedia photos in `assets/images/fleet/*.jpg` (plus `eqe-suv.jpg`) are no longer shown anywhere; their credits are kept in the README. Replace all of these with the client's own photos as they arrive (her white EQS SUV first).
- The enquiry form has a "Flight details" group (airline, flight number, arriving from / flying to, scheduled time). It shows only for airport services, and its labels switch between arrival and departure (app.js); its values go into the WhatsApp message.
- Clearly separate company-owned vehicles from vehicles supplied by partner operators.
- Any non-client fleet photo must remain labeled as reference imagery and must have suitable commercial-use rights plus attribution where required.
- Do not say online payment is enabled until a provider, credentials and payment workflow have been supplied.
- Keep to the agreed basic website scope (pricing lives in the private notes repo, Technovabb/ridewithhr). Custom booking/payment systems, live availability, dispatch, user accounts and a full CMS are separate-scope features.

## Architecture

- `assets/js/content.js` is the lightweight editable content/config layer.
- The primary navigation must continue to link to standalone pages: Home, Services, Fleet, About and Enquire.
- The booking form sends enquiries by **WhatsApp** to +1 (246) 231-2679 (`booking.mode: "whatsapp"`, supplied by Juwan on 14 Oct 2026). It opens a pre-filled chat and the customer presses send; it does not book or take payment. The same number also takes calls (confirmed 14 Oct 2026). It's hard-coded in each page's footer (call + WhatsApp), the floating WhatsApp button and the call line on `enquire.html`; change them all together.
- Every enquiry also gets a reference (HR-YYMMDD-NNNN) and an **email copy** to `business.email` in content.js (renne@ridewithhr.com for now; info@ once that shared mailbox exists), sent through FormSubmit's AJAX endpoint (`booking.emailCopy`). FormSubmit needs a one-time activation click in that inbox, and it answers 200 even on failure, so check the JSON `success` field. A hidden `_honey` field traps bots. The privacy notice names FormSubmit.
- GitHub Pages is the intended preview host. All URLs are relative so project-site paths work.
- Preserve accessibility, responsive behavior and reduced-motion support.

## Privacy and booking terms

- `privacy.html` and `terms.html` are drafts (14 Oct 2026). They are linked from every footer and from the form's consent box.
- Answered 18 Oct 2026: enquiry details are kept for 4 weeks; payment by card, cash or bank transfer. Still marked `<span class="tbc">… to be confirmed …</span>`: data-protection contact, any deposit, cancellation, waiting time. Never fill these in with guesses. Replace each with her wording, then remove the "draft" ribbon and notice.
- The terms say how prices work (priced per request), not the prices themselves.

## Before production launch

Resolve every item in the README's “Client information still required” section, replace preview notices as appropriate, verify final contact routing, add privacy/booking terms, and test the final domain on mobile.
