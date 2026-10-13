# Claude handoff: Ride With HR

This is a buildless, multi-page static website. Work directly in `index.html`, `services.html`, `fleet.html`, `about.html`, `enquire.html`, `assets/css/styles.css`, `assets/js/content.js`, and `assets/js/app.js`. Keep the main content areas as separate pages rather than collapsing them into a one-page scrolling site. Do not introduce a framework or package manager unless the owner explicitly requests one.

## Non-negotiable content rules

- The company is **H&R Transport** and the customer-facing brand is **Ride With HR**.
- Do not change the company name for SEO. Use local phrases naturally: Barbados airport transfer, Barbados chauffeur, private driver Barbados, executive transport Barbados, and Grantley Adams airport transfer.
- Do not invent prices, testimonials, availability, vehicle specifications, business contact details or operating hours.
- The only explicitly confirmed company-owned fleet model is a **2025 Mercedes-Benz EQE SUV**. The proposal also lists a 2026 BMW iX, 2025 BMW i5, 2025 Mercedes-Benz EQS SUV, Mercedes-Benz EQE sedan, Range Rover Sport, Toyota Hiace and Nissan Serena. Treat these as proposal-listed options until ownership, specification and availability are confirmed.
- Clearly separate company-owned vehicles from vehicles supplied by partner operators.
- Any non-client fleet photo must remain labeled as reference imagery and must have suitable commercial-use rights plus attribution where required.
- Do not say online payment is enabled until a provider, credentials and payment workflow have been supplied.
- Keep the original fixed **BBD $2,500 basic website quote** in mind. Custom booking/payment systems, live availability, dispatch, user accounts and a full CMS are separate-scope features.

## Architecture

- `assets/js/content.js` is the lightweight editable content/config layer.
- The primary navigation must continue to link to standalone pages: Home, Services, Fleet, About and Enquire.
- The booking form is preview-only until a confirmed destination email is added and `booking.mode` is set to `email`.
- GitHub Pages is the intended preview host. All URLs are relative so project-site paths work.
- Preserve accessibility, responsive behavior and reduced-motion support.

## Before production launch

Resolve every item in the README's “Client information still required” section, replace preview notices as appropriate, verify final contact routing, add privacy/booking terms, and test the final domain on mobile.
