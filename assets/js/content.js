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
    phone: "", // Add the confirmed public telephone/WhatsApp number.
    website: "", // Add https://ridewithhr.com only after the domain is purchased and connected.
  },
  booking: {
    mode: "preview", // Change to "email" after business.email is set. Provider integrations are a later scope.
    paymentEnabled: false,
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
    { year: "2025", make: "Mercedes-Benz", model: "EQS SUV", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Mercedes-Benz", model: "EQE sedan", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Range Rover", model: "Sport", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Toyota", model: "Hiace", relationship: "proposal-listed-to-confirm" },
    { year: "", make: "Nissan", model: "Serena", relationship: "proposal-listed-to-confirm" },
  ],
};
