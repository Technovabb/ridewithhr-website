# Claude handoff: Ride With HR

This is a buildless, multi-page static website. Work directly in `index.html`, `services.html`, `fleet.html`, `about.html`, `enquire.html`, `assets/css/styles.css`, `assets/js/content.js`, and `assets/js/app.js`. Keep the main content areas as separate pages rather than collapsing them into a one-page scrolling site. Do not introduce a framework or package manager unless the owner explicitly requests one.

## Non-negotiable content rules

- The company is **H&R Transport** and the customer-facing brand is **Ride With HR**.
- Do not change the company name for SEO. Use local phrases naturally: Barbados airport transfer, Barbados chauffeur, private driver Barbados, executive transport Barbados, and Grantley Adams airport transfer.
- Do not invent prices, testimonials, availability, vehicle specifications, business contact details or operating hours.
- The confirmed company-owned fleet models are a **2025 Mercedes-Benz EQE SUV** and a **2025 Mercedes-Benz EQS SUV** (white; confirmed by Juwan on 14 Oct 2026). The proposal also lists a 2026 BMW iX, 2025 BMW i5, Mercedes-Benz EQE sedan, Range Rover Sport and Toyota Hiace. Treat these as proposal-listed options until ownership, specification and availability are confirmed.
- The proposal's Nissan Serena is a **luggage vehicle, not part of the passenger fleet** (Juwan, 14 Oct 2026). Keep it out of the fleet gallery, slideshow and vehicle lists.
- The home-page hero is a slideshow of every fleet model (owner's request, 14 Oct 2026), starting with the white EQS SUV. Each slide is labelled "company fleet" or "fleet option" plus "reference image". The Fleet page gallery uses the same photos (`assets/images/fleet/`, plus `eqe-suv.jpg`).
  - All are licensed Wikimedia Commons reference photos. Their credits are in the footer of `index.html` and `fleet.html` and in the README; keep them in step when photos change.
  - Replace photos with the client's own as they arrive (her white EQS SUV first).
  - The slideshow pauses on hover, in hidden tabs, with its pause button, and for reduced motion. Each slide loads just before its turn (`data-src`).
- Clearly separate company-owned vehicles from vehicles supplied by partner operators.
- Any non-client fleet photo must remain labeled as reference imagery and must have suitable commercial-use rights plus attribution where required.
- Do not say online payment is enabled until a provider, credentials and payment workflow have been supplied.
- Keep to the agreed basic website scope (pricing lives in the private notes repo, Technovabb/ridewithhr). Custom booking/payment systems, live availability, dispatch, user accounts and a full CMS are separate-scope features.

## Architecture

- `assets/js/content.js` is the lightweight editable content/config layer.
- The primary navigation must continue to link to standalone pages: Home, Services, Fleet, About and Enquire.
- The booking form sends enquiries by **WhatsApp** to +1 (246) 231-2679 (`booking.mode: "whatsapp"`, supplied by Juwan on 14 Oct 2026). It opens a pre-filled chat and the customer presses send; it does not book or take payment. The same number is hard-coded in each page's footer and floating button. Don't add a `tel:` link until it's confirmed the number takes calls.
- GitHub Pages is the intended preview host. All URLs are relative so project-site paths work.
- Preserve accessibility, responsive behavior and reduced-motion support.

## Before production launch

Resolve every item in the README's “Client information still required” section, replace preview notices as appropriate, verify final contact routing, add privacy/booking terms, and test the final domain on mobile.
