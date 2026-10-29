(function () {
  "use strict";

  var config = window.RIDE_WITH_HR || {};
  var meetAndGreet = config.booking && config.booking.arrivalMeetAndGreet;
  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var form = document.querySelector("[data-booking-form]");
  var dialog = document.querySelector("[data-enquiry-dialog]");

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // Google Ads and Analytics (the Google tag in each page's head): count enquiries and taps on WhatsApp,
  // phone and email links, so Google Ads can learn which clicks lead to bookings. Does nothing if the
  // tag is blocked.
  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }
  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;
    var href = link.getAttribute("href") || "";
    var method = href.indexOf("https://wa.me/") === 0 ? "whatsapp" : href.indexOf("tel:") === 0 ? "phone" : href.indexOf("mailto:") === 0 ? "email" : "";
    if (method) track("contact", { method: method });
  });

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(willOpen));
      nav.classList.toggle("open", willOpen);
      document.body.classList.toggle("nav-open", willOpen);
    });
    nav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeNav); });
  }

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  document.querySelectorAll("[data-service-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      var field = document.querySelector("#service");
      if (field) field.value = link.getAttribute("data-service-link");
    });
  });

  var revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  document.querySelectorAll(".reveal").forEach(function (item) {
    if (revealObserver) revealObserver.observe(item);
    else item.classList.add("visible");
  });

  // Home hero: the fleet photos take turns. Each photo loads just before its turn.
  // Stops for "reduced motion", on hover, when the tab is hidden, or with the pause button.
  var rotator = document.querySelector("[data-rotator]");
  if (rotator) {
    var slides = Array.prototype.slice.call(rotator.querySelectorAll(".rotator-slides img"));
    var caption = rotator.querySelector("[data-rotator-caption]");
    var pauseButton = rotator.querySelector("[data-rotator-pause]");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = 0;
    var timer = null;
    var paused = false;
    var hovering = false;

    var loadSlide = function (img) {
      if (img && img.getAttribute("data-src")) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      }
    };
    var showSlide = function (next) {
      slides[current].classList.remove("is-active");
      slides[current].setAttribute("aria-hidden", "true");
      current = (next + slides.length) % slides.length;
      loadSlide(slides[current]);
      slides[current].classList.add("is-active");
      slides[current].removeAttribute("aria-hidden");
      if (caption) caption.textContent = slides[current].getAttribute("data-caption");
      loadSlide(slides[(current + 1) % slides.length]);
    };
    var stopRotation = function () {
      if (timer) window.clearInterval(timer);
      timer = null;
    };
    var startRotation = function () {
      stopRotation();
      if (slides.length > 1 && !reduceMotion && !paused && !hovering && !document.hidden) {
        timer = window.setInterval(function () { showSlide(current + 1); }, 5000);
      }
    };

    if (slides.length > 1 && !reduceMotion) loadSlide(slides[1]);
    if (pauseButton) {
      pauseButton.addEventListener("click", function () {
        paused = !paused;
        pauseButton.setAttribute("aria-pressed", String(paused));
        pauseButton.setAttribute("aria-label", paused ? "Play the fleet slideshow" : "Pause the fleet slideshow");
        pauseButton.firstElementChild.textContent = paused ? "▶" : "❚❚";
        startRotation();
      });
    }
    rotator.addEventListener("mouseenter", function () { hovering = true; stopRotation(); });
    rotator.addEventListener("mouseleave", function () { hovering = false; startRotation(); });
    document.addEventListener("visibilitychange", startRotation);
    startRotation();
  }

  function labelFor(name) {
    var labels = {
      service: "Service", pickup: "Pick-up", destination: "Destination",
      date: "Date", time: "Preferred time", trip: "Trip", returnDate: "Return date", returnTime: "Return time",
      passengers: "Passengers", suitcases: "Suitcases", childSeats: "Child seats", vehicle: "Vehicle",
      luggageVehicle: "Luggage vehicle", airline: "Airline", flight: "Flight number", name: "Name", email: "Email", phone: "Mobile / WhatsApp", notes: "Notes"
    };
    return labels[name] || name;
  }

  // A short reference shared by the WhatsApp message and the email copy, e.g. HR-261018-4821.
  function makeReference() {
    var d = new Date();
    var ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    return "HR-" + ymd + "-" + String(Math.floor(1000 + Math.random() * 9000));
  }

  // Every enquiry is also emailed to the business through FormSubmit (form-to-email service).
  // FormSubmit answers 200 even when it fails, so the JSON "success" field is what counts.
  // keepalive lets the request finish even if the page hands over to the WhatsApp app.
  // Emails an enquiry to business.email through FormSubmit. Resolves to { ok, message } and never rejects.
  // FormSubmit answers 200 even when it refuses, so success is its JSON "success" field. It can take
  // 15-20 seconds to answer, hence the generous timeout. keepalive lets a background copy finish while
  // the page hands over to WhatsApp.
  function sendEnquiryEmail(form, summary, reference, keepalive) {
    var to = config.business && config.business.email;
    if (!to || !window.fetch) return Promise.resolve({ ok: false, message: "No email address is set up." });
    var data = new FormData(form);
    var payload = {
      _subject: "Website enquiry " + reference + " (" + (data.get("service") || "journey") + ")",
      _template: "box",
      _honey: data.get("_honey") || "",
      reference: reference,
      name: data.get("name") || "",
      email: data.get("email") || "",
      enquiry: summary
    };
    if (config.booking && config.booking.emailCc) payload._cc = config.booking.emailCc;
    if (data.get("email")) {
      payload._replyto = data.get("email");
      payload._autoresponse = "Thank you for your enquiry to H&R Executive Chauffeur Services (reference " + reference + "). " +
        "We'll reply with your price and confirmation. Nothing is booked until we confirm it.";
    }
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 45000) : null;
    return fetch("https://formsubmit.co/ajax/" + to, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      keepalive: !!keepalive,
      signal: controller ? controller.signal : undefined
    }).then(function (response) { return response.json(); }).then(function (result) {
      var ok = String(result.success) === "true";
      if (!ok && window.console) console.warn("Enquiry email not sent:", result.message);
      return { ok: ok, message: result.message || "" };
    }).catch(function (error) {
      return { ok: false, message: String(error) };
    }).then(function (outcome) {
      if (timer) clearTimeout(timer);
      return outcome;
    });
  }

  // Each enquiry also goes to the H&R app server (when booking.appIntake is set), in parallel with the email.
  // text/plain JSON needs no CORS preflight; no cookies are sent. Resolves to { ok } and never rejects.
  var formShownAt = Date.now();
  function sendToApp(form, reference, keepalive) {
    var url = config.booking && config.booking.appIntake;
    if (!url || !window.fetch) return Promise.resolve({ ok: false, skipped: true });
    var d = new FormData(form);
    var get = function (k) { return String(d.get(k) || "").trim(); };
    var payload = {
      reference: reference, service: get("service"), pickup: get("pickup"), destination: get("destination"),
      date: get("date"), time: get("time"), passengers: Number(get("passengers")) || 1,
      trip: get("trip") === "Return" ? "Return" : "One-way", returnDate: get("returnDate") || null, returnTime: get("returnTime") || null,
      suitcases: Number(get("suitcases")) || 0, childSeats: Number(get("childSeats")) || 0, luggageVehicle: d.get("luggageVehicle") !== null,
      airline: get("airline"), flight: get("flight"), flightRoute: get("flightRoute"), flightTime: get("flightTime"),
      name: get("name"), email: get("email"), phone: get("phone"), notes: get("notes"),
      consent: d.get("consent") !== null, _honey: get("_honey"), t: Date.now() - formShownAt
    };
    return fetch(url, {
      method: "POST", mode: "cors", credentials: "omit", keepalive: !!keepalive,
      headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().then(function (json) { return { ok: response.ok && !!json.ok }; }, function () { return { ok: response.ok }; });
    }).catch(function () { return { ok: false }; });
  }

  function buildSummary(data, heading, reference) {
    var lines = [heading || "H&R EXECUTIVE SERVICES — TRANSPORT ENQUIRY", ""];
    if (reference) lines.push("Reference: " + reference);
    ["service", "trip", "pickup", "destination", "date", "time", "returnDate", "returnTime", "passengers", "suitcases", "childSeats",
      "vehicle", "luggageVehicle", "airline", "flight", "flightRoute", "flightTime", "name", "email", "phone", "notes"].forEach(function (key) {
      var value = String(data.get(key) || "").trim();
      if (key === "childSeats" && value === "0") value = "";
      if ((key === "date" || key === "returnDate") && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        var parts = value.split("-");
        value = new Date(+parts[0], +parts[1] - 1, +parts[2]).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      }
      // Flight labels follow the service: where an arriving flight comes from, or where a departing one goes.
      var isDeparture = data.get("service") === "Airport departure";
      var label = key === "flightRoute" ? (isDeparture ? "Flying to" : "Arriving from")
        : key === "flightTime" ? (isDeparture ? "Flight departs" : "Flight lands")
        : labelFor(key);
      if (value) lines.push(label + ": " + value);
      if (key === "service" && value === "Airport arrival" && meetAndGreet) {
        lines.push("Meet-and-greet: included with every airport arrival");
      }
    });
    lines.push("", "This is an enquiry only. Journey, vehicle, price and availability are still to be confirmed.");
    return lines.join("\n");
  }

  if (form) {
    // Times are picked from a list instead of typed (Juwan, 29 Oct 2026): every 15 minutes, flight times every 5.
    // The page itself keeps plain time boxes, so the form still works if this script doesn't run.
    var timeLabel = function (hhmm) {
      var h = Number(hhmm.slice(0, 2)), m = hhmm.slice(3);
      var label = ((h + 11) % 12 + 1) + ":" + m + (h < 12 ? " am" : " pm");
      return hhmm === "00:00" ? label + " (midnight)" : hhmm === "12:00" ? label + " (noon)" : label;
    };
    form.querySelectorAll("input[type='time']").forEach(function (box) {
      var step = box.name === "flightTime" ? 5 : 15;
      var list = document.createElement("select");
      list.id = box.id;
      list.name = box.name;
      list.required = box.required;
      list.disabled = box.disabled;
      list.add(new Option("Choose a time", ""));
      for (var minute = 0; minute < 24 * 60; minute += step) {
        var hhmm = String(Math.floor(minute / 60)).padStart(2, "0") + ":" + String(minute % 60).padStart(2, "0");
        list.add(new Option(timeLabel(hhmm), hhmm));
      }
      box.replaceWith(list);
    });

    var serviceInput = form.querySelector("#service");
    var requestedService = new URLSearchParams(window.location.search).get("service");
    if (serviceInput && requestedService) {
      var hasRequestedService = Array.from(serviceInput.options).some(function (option) { return option.value === requestedService; });
      if (hasRequestedService) serviceInput.value = requestedService;
    }

    // The homepage journey starter carries the first details into this full form.
    var requestedDetails = new URLSearchParams(window.location.search);
    ["pickup", "destination", "date"].forEach(function (name) {
      var target = form.elements[name];
      var value = (requestedDetails.get(name) || "").trim();
      if (target && value) target.value = value.slice(0, 120);
    });

    // The airport note (the meet-and-greet) shows for airport arrivals and departures.
    var airportNote = form.querySelector("[data-airport-note]");
    var toggleAirportNote = function () {
      if (airportNote && serviceInput) airportNote.hidden = serviceInput.value.indexOf("Airport") !== 0;
    };
    if (serviceInput) serviceInput.addEventListener("change", toggleAirportNote);
    toggleAirportNote();

    // Flight details show only for airport journeys (hidden fields are disabled, so they stay out of the message).
    // The labels follow the service: arriving from / landing time, or flying to / departure time.
    var flightFields = form.querySelectorAll("[data-flight-field]");
    var toggleFlight = function () {
      var service = serviceInput ? serviceInput.value : "";
      var isAirport = service.indexOf("Airport") === 0;
      var isDeparture = service === "Airport departure";
      flightFields.forEach(function (field) {
        field.hidden = !isAirport;
        var input = field.querySelector("input, select");
        if (input) input.disabled = !isAirport;
      });
      var routeLabel = form.querySelector("[data-flight-route-label]");
      var timeLabel = form.querySelector("[data-flight-time-label]");
      if (routeLabel) routeLabel.textContent = isDeparture ? "Flying to" : "Arriving from";
      if (timeLabel) timeLabel.textContent = isDeparture ? "Scheduled departure time" : "Scheduled landing time";
    };
    if (serviceInput) serviceInput.addEventListener("change", toggleFlight);
    toggleFlight();

    var dateInput = form.querySelector("#date");
    var returnDateInput = form.querySelector("#return-date");
    if (dateInput) {
      var today = new Date();
      var localDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
      dateInput.min = localDate;
      if (returnDateInput) {
        returnDateInput.min = localDate;
        dateInput.addEventListener("change", function () { returnDateInput.min = dateInput.value || localDate; });
      }
    }

    // Return trips: show and require the return date and time; one-way trips leave them out of the message.
    var tripInput = form.querySelector("#trip");
    var toggleReturn = function () {
      var isReturn = tripInput && tripInput.value === "Return";
      form.querySelectorAll("[data-return-field]").forEach(function (field) {
        field.hidden = !isReturn;
        var input = field.querySelector("input, select");
        input.disabled = !isReturn;
        input.required = isReturn;
      });
    };
    if (tripInput) tripInput.addEventListener("change", toggleReturn);
    toggleReturn();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-form-status]");
      status.classList.remove("is-ok");
      form.querySelectorAll("[aria-invalid]").forEach(function (field) { field.removeAttribute("aria-invalid"); });

      if (!form.checkValidity()) {
        var invalid = form.querySelector(":invalid");
        if (invalid) {
          invalid.setAttribute("aria-invalid", "true");
          invalid.focus();
        }
        status.textContent = "Please complete the required fields before preparing your enquiry.";
        return;
      }

      // A reply needs a way to reach the guest: an email or a mobile number.
      var emailField = form.elements.email; var phoneField = form.elements.phone;
      if (phoneField && emailField && !emailField.value.trim() && !phoneField.value.trim()) {
        emailField.setAttribute("aria-invalid", "true");
        emailField.focus();
        status.textContent = "Please give an email address or a mobile number so we can reply with your price.";
        return;
      }

      status.textContent = "";
      var bookingEmail = config.business && config.business.email;
      var whatsapp = config.business && config.business.whatsapp;
      var mode = config.booking && config.booking.mode;

      // Email: the enquiry goes straight to the team's inbox and the page confirms it. If the email can't
      // be sent, the customer is offered WhatsApp instead, so no request is lost.
      if (mode === "email-direct" && bookingEmail) {
        var emailReference = makeReference();
        var submitButton = form.querySelector("[type='submit']");
        var waFallback = whatsapp ? "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(buildSummary(new FormData(form), "Hello H&R Executive Chauffeur Services, I'd like to arrange a journey:", emailReference)) : "";
        if (submitButton) submitButton.disabled = true;
        status.textContent = "Sending your enquiry. This can take up to half a minute.";
        Promise.all([
          sendEnquiryEmail(form, buildSummary(new FormData(form), null, emailReference), emailReference, false),
          sendToApp(form, emailReference, false)
        ]).then(function (results) {
          var result = { ok: results[0].ok || results[1].ok };   // either the email or the app is enough
          if (submitButton) submitButton.disabled = false;
          if (result.ok) {
            track("generate_lead", { method: "enquiry form", service: form.elements.service ? form.elements.service.value : "" });
            form.reset();
            toggleFlight();
            toggleReturn();
            status.classList.add("is-ok");
            status.textContent = "Thank you. Your enquiry has been sent to our team (reference " + emailReference + "). We'll reply to confirm your price and availability. Nothing is booked until we confirm it.";
            return;
          }
          status.textContent = "We couldn't send your enquiry just now. Your details are still in the form.";
          if (waFallback) {
            var fallback = document.createElement("a");
            fallback.href = waFallback;
            fallback.target = "_blank";
            fallback.rel = "noopener";
            fallback.textContent = "Send it to us on WhatsApp instead.";
            status.appendChild(document.createTextNode(" "));
            status.appendChild(fallback);
          }
        });
        return;
      }

      // WhatsApp: open a chat with the enquiry typed in; the customer presses send.
      // A new tab keeps the site open on desktop; phones hand over to the WhatsApp app.
      if (mode === "whatsapp" && whatsapp) {
        var reference = makeReference();
        var message = buildSummary(new FormData(form), "Hello H&R Executive Chauffeur Services, I'd like to arrange a journey:", reference);
        if (config.booking && config.booking.emailCopy) sendEnquiryEmail(form, buildSummary(new FormData(form), null, reference), reference, true);
        sendToApp(form, reference, true); // fire and forget: WhatsApp must still open in this same tap
        var waUrl = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message);
        var waWindow = window.open(waUrl, "_blank");
        if (waWindow) waWindow.opener = null;
        else window.location.href = waUrl;
        track("generate_lead", { method: "whatsapp form", service: form.elements.service ? form.elements.service.value : "" });
        status.classList.add("is-ok");
        status.textContent = "WhatsApp is opening with your details (reference " + reference + "). Press send there to reach us.";
        var retry = document.createElement("a");
        retry.href = waUrl;
        retry.target = "_blank";
        retry.rel = "noopener";
        retry.textContent = "Didn't open? Tap here.";
        status.appendChild(document.createTextNode(" "));
        status.appendChild(retry);
        return;
      }

      var summary = buildSummary(new FormData(form));
      if (mode === "email" && bookingEmail) {
        var subject = encodeURIComponent("Transport enquiry — " + form.elements.service.value);
        window.location.href = "mailto:" + bookingEmail + "?subject=" + subject + "&body=" + encodeURIComponent(summary);
        return;
      }

      var summaryField = dialog && dialog.querySelector("[data-enquiry-summary]");
      if (summaryField) summaryField.value = summary;
      if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      else window.prompt("Copy your enquiry summary:", summary);
    });
  }

  // Prevent past dates in the compact homepage journey starter.
  var starterDate = document.querySelector("[data-journey-starter] input[type='date']");
  if (starterDate) {
    var starterToday = new Date();
    starterDate.min = [starterToday.getFullYear(), String(starterToday.getMonth() + 1).padStart(2, "0"), String(starterToday.getDate()).padStart(2, "0")].join("-");
  }

  if (dialog) {
    dialog.querySelector("[data-dialog-close]").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelector("[data-copy-summary]").addEventListener("click", function () {
      var text = dialog.querySelector("[data-enquiry-summary]").value;
      var status = dialog.querySelector("[data-dialog-status]");
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = "Copied. You can paste this into an email or message.";
      }).catch(function () {
        dialog.querySelector("[data-enquiry-summary]").select();
        status.textContent = "Select and copy the highlighted summary.";
      });
    });
  }

  // Fleet page: click or tap a vehicle image (or press Enter on it) to see it larger.
  // The arrow buttons, arrow keys or a swipe move between vehicles; Esc, the close button
  // or a click outside the picture closes it. Each image keeps its "illustrative" note.
  var fleetFigures = Array.prototype.slice.call(document.querySelectorAll(".fleet-gallery figure"));
  if (fleetFigures.length && typeof HTMLDialogElement === "function") {
    var viewerItems = [];
    fleetFigures.forEach(function (figure) {
      var img = figure.querySelector(".fg-img img");
      var nameEl = figure.querySelector("figcaption strong");
      if (!img || !nameEl) return;
      var tag = figure.querySelector(".fg-tag");
      var request = figure.querySelector(".fg-request");
      viewerItems.push({ img: img, name: nameEl.textContent.trim(), status: tag ? tag.textContent.trim() : "", href: request ? request.getAttribute("href") : "" });
    });

    var viewer = document.createElement("dialog");
    viewer.className = "fleet-lightbox";
    viewer.setAttribute("aria-label", "Vehicle image viewer");
    viewer.innerHTML =
      '<div class="lb-stage"><img class="lb-img" alt="" width="1600" height="1000" />' +
      '<button class="lb-prev" type="button" aria-label="Previous vehicle"><span aria-hidden="true">&#8249;</span></button>' +
      '<button class="lb-next" type="button" aria-label="Next vehicle"><span aria-hidden="true">&#8250;</span></button>' +
      '<p class="lb-count"></p></div>' +
      '<div class="lb-caption" aria-live="polite"><strong class="lb-name"></strong><span class="lb-note"></span>' +
      '<a class="lb-request" href="enquire">Plan a journey <b aria-hidden="true">&rarr;</b></a></div>' +
      '<button class="lb-close" type="button" aria-label="Close the image viewer"><span aria-hidden="true">&times;</span></button>';
    document.body.appendChild(viewer);
    var viewerImg = viewer.querySelector(".lb-img");
    var viewerRequest = viewer.querySelector(".lb-request");
    var shownIndex = 0;

    var srcOf = function (img) { return img.getAttribute("src"); };
    var showVehicle = function (index) {
      shownIndex = (index + viewerItems.length) % viewerItems.length;
      var item = viewerItems[shownIndex];
      viewerImg.src = srcOf(item.img);
      viewerImg.alt = item.img.alt;
      viewer.querySelector(".lb-name").textContent = item.name;
      viewer.querySelector(".lb-note").textContent = (item.status ? item.status + " · " : "") + "Illustrative model reference · exact vehicle confirmed when booking";
      viewerRequest.hidden = !item.href;
      if (item.href) viewerRequest.setAttribute("href", item.href);
      viewer.querySelector(".lb-count").textContent = (shownIndex + 1) + " of " + viewerItems.length;
      // Fetch the neighbours now so the next swipe is instant (the gallery images are lazy-loaded).
      [shownIndex + 1, shownIndex - 1].forEach(function (n) {
        new Image().src = srcOf(viewerItems[(n + viewerItems.length) % viewerItems.length].img);
      });
    };
    var viewerOpener = null;
    var openViewer = function (index, opener) {
      viewerOpener = opener || null;
      showVehicle(index);
      document.documentElement.classList.add("lb-open");
      viewer.showModal();
      viewer.querySelector(".lb-close").focus();
    };

    // Each image becomes a button. The featured EQE SUV opens on its gallery entry.
    var addTrigger = function (img, index, name) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "zoom-trigger";
      button.setAttribute("aria-label", "View a larger image of the " + name);
      img.parentNode.insertBefore(button, img);
      button.appendChild(img);
      var hint = document.createElement("span");
      hint.className = "zoom-hint";
      hint.setAttribute("aria-hidden", "true");
      hint.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
      button.appendChild(hint);
      button.addEventListener("click", function () { openViewer(index, button); });
    };
    viewerItems.forEach(function (item, index) { addTrigger(item.img, index, item.name); });
    var featuredImg = document.querySelector(".fleet-page .vehicle-image-wrap img");
    if (featuredImg) {
      var featuredIndex = -1;
      viewerItems.forEach(function (item, index) {
        if (item.img.getAttribute("src") === featuredImg.getAttribute("src")) featuredIndex = index;
      });
      if (featuredIndex >= 0) addTrigger(featuredImg, featuredIndex, viewerItems[featuredIndex].name);
    }

    viewer.querySelector(".lb-prev").addEventListener("click", function () { showVehicle(shownIndex - 1); });
    viewer.querySelector(".lb-next").addEventListener("click", function () { showVehicle(shownIndex + 1); });
    // Esc, the close button and a click outside all close it the same way: unlock the page and
    // return focus to the image that opened it. (The dialog's own "close" event covers any other route.)
    var afterViewerClose = function () {
      if (!document.documentElement.classList.contains("lb-open")) return;
      document.documentElement.classList.remove("lb-open");
      if (viewerOpener) viewerOpener.focus();
    };
    var closeViewer = function () {
      if (viewer.open) viewer.close();
      afterViewerClose();
    };
    viewer.querySelector(".lb-close").addEventListener("click", closeViewer);
    viewer.addEventListener("click", function (event) { if (event.target === viewer) closeViewer(); });
    viewer.addEventListener("close", afterViewerClose);
    viewer.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { event.preventDefault(); closeViewer(); }
      if (event.key === "ArrowRight") { event.preventDefault(); showVehicle(shownIndex + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); showVehicle(shownIndex - 1); }
    });
    var touchX = null, touchY = null;
    viewer.addEventListener("touchstart", function (event) {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    }, { passive: true });
    viewer.addEventListener("touchend", function (event) {
      if (touchX === null) return;
      var dx = event.changedTouches[0].clientX - touchX;
      var dy = event.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showVehicle(shownIndex + (dx < 0 ? 1 : -1));
      touchX = touchY = null;
    }, { passive: true });
  }

  // Cookieless visit counting for the H&R back office (when booking.visitBeacon is set): the page path
  // and the referring site's name only. No cookies, nothing stored on the phone, no IP addresses kept.
  var beacon = config.booking && config.booking.visitBeacon;
  if (beacon && navigator.sendBeacon && !document.prerendering) {
    var refHost = "";
    try { refHost = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) { refHost = ""; }
    try { navigator.sendBeacon(beacon, new Blob([JSON.stringify({ p: location.pathname, r: refHost, s: "web" })], { type: "text/plain" })); } catch (e) { /* never mind */ }
  }
})();
