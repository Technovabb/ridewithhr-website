/**
 * Ride With HR content settings
 * -----------------------------
 * Keep business details here so they can be updated without changing the layout.
 * Empty values intentionally keep unconfirmed details off the public site.
 */
window.RIDE_WITH_HR = {
  business: {
    legalName: "H&R Transport",
    brandName: "Ride With HR",
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
    // Prices from Juwan, 14 Oct 2026. Also written into index.html, services.html and the arrival
    // note on enquire.html; change them all together.
    arrivalMeetAndGreetUSD: 40, // compulsory on every airport arrival
    southCoastArrivalUSD: 100, // airport → South Coast, total including the meet-and-greet
    westCoastArrivalUSD: 125, // airport → West Coast, total including the meet-and-greet
    northWestArrivalUSD: 150, // airport → North West, total including the meet-and-greet
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
    { year: "2025", make: "BMW", model: "i5", relationship: "proposal-listed-to-confirm" },
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
