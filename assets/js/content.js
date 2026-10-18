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
    email: "", // Add the confirmed booking email to enable mail delivery.
    phone: "+12462312679", // +1 (246) 231-2679 takes calls too (Juwan, 14 Oct 2026). Hard-coded as tel: links in the footers and on enquire.html.
    whatsapp: "12462312679", // +1 (246) 231-2679, digits only for wa.me links (from Juwan, 14 Oct 2026). Also hard-coded in each page's footer and floating button.
    website: "", // Add https://ridewithhr.com only after the domain is purchased and connected.
  },
  booking: {
    // "whatsapp" opens WhatsApp with the enquiry ready to send; "email" opens a mail to business.email;
    // "preview" only shows a copyable summary. Provider integrations are a later scope.
    mode: "whatsapp",
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
    { year: "2026", make: "BMW", model: "iX", relationship: "proposal-listed-to-confirm" },
    { year: "2025", make: "BMW", model: "i5 (white)", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "BMW", model: "i5 (charcoal)", relationship: "company-owned" }, // her own car, confirmed by Juwan 17 Oct 2026 (model year not given)
    {
      year: "2025",
      make: "Mercedes-Benz",
      model: "EQS SUV",
      relationship: "company-owned", // confirmed by Juwan, 14 Oct 2026 (white)
      availability: "confirm-per-journey",
      imageType: "licensed-reference",
    },
    { year: "", make: "Mercedes-Benz", model: "EQE sedan", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Range Rover", model: "Sport", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Toyota", model: "Hiace", relationship: "proposal-listed-to-confirm" },
    // The Nissan Serena is a luggage vehicle, not a passenger fleet vehicle (Juwan, 14 Oct 2026).
  ],
};
