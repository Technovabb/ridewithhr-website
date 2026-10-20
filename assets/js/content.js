/**
 * H&R Executive Services (ridewithhr.com) content settings
 * -----------------------------
 * Keep business details here so they can be updated without changing the layout.
 * Empty values intentionally keep unconfirmed details off the public site.
 */
window.RIDE_WITH_HR = {
  business: {
    legalName: "", // registered legal name to be confirmed by the client
    brandName: "H&R Executive Services",
    email: "admin@ridewithhr.com", // shared mailbox for enquiry copies and the site's contact links (Juwan, 20 Oct 2026). FormSubmit needs a one-time activation click in this inbox.
    phone: "+12462312679", // +1 (246) 231-2679 takes calls too (Juwan, 14 Oct 2026). Hard-coded as tel: links in the footers and on enquire.html.
    whatsapp: "12462312679", // +1 (246) 231-2679, digits only for wa.me links (from Juwan, 14 Oct 2026). Also hard-coded in each page's footer and floating button.
    website: "https://ridewithhr.com", // live domain (GitHub Pages custom domain, Oct 2026)
  },
  booking: {
    // "email-direct" emails each enquiry straight to business.email through FormSubmit and confirms on the page,
    // offering WhatsApp only if sending fails (Juwan, 20 Oct 2026: "push all requests to the email").
    // "whatsapp" opens WhatsApp with the enquiry ready to send; "email" opens a mail to business.email;
    // "preview" only shows a copyable summary.
    mode: "email-direct",
    emailCopy: true, // in "whatsapp" mode, also email a copy through FormSubmit (needs a one-time activation click in that inbox)
    paymentEnabled: false,
    // No prices on the site (Juwan, 18 Oct 2026): the owner prices each journey after the request.
    // Prices stay in the private notes repo (docs/pricing.md).
    arrivalMeetAndGreet: true, // every airport arrival includes a meet-and-greet
  },
  fleet: [
    {
      year: "2025",
      make: "Mercedes-Benz",
      model: "EQE SUV",
      relationship: "company-owned",
      availability: "confirm-per-journey",
      imageType: "licensed-reference",
    },
    { year: "2026", make: "BMW", model: "iX", relationship: "company-owned" }, // her company fleet (Renee via Juwan, 20 Oct 2026); year from her proposal
    { year: "2025", make: "BMW", model: "i5 (white)", relationship: "proposal-listed-to-confirm" },
    { year: "2026", make: "BMW", model: "i5 (charcoal)", relationship: "company-owned" }, // her own car (Juwan, 17 Oct 2026); 2026 model (Juwan, 19 Oct 2026)
    {
      year: "2025",
      make: "Mercedes-Benz",
      model: "EQS SUV",
      relationship: "fleet-option-to-confirm", // not hers: her only Mercedes is the EQE SUV (Juwan, 19 Oct 2026)
      availability: "confirm-per-journey",
      imageType: "licensed-reference",
    },
    { year: "", make: "Mercedes-Benz", model: "EQE sedan", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Range Rover", model: "Sport", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Toyota", model: "Hiace", relationship: "company-owned" }, // her company fleet (Renee via Juwan, 20 Oct 2026)
    // The Nissan Serena is a luggage vehicle, not a passenger fleet vehicle (Juwan, 14 Oct 2026).
  ],
};
