(function () {
  "use strict";

  var config = window.RIDE_WITH_HR || {};
  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var form = document.querySelector("[data-booking-form]");
  var dialog = document.querySelector("[data-enquiry-dialog]");

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

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
      date: "Date", time: "Preferred time", passengers: "Passengers",
      flight: "Flight number", name: "Name", email: "Email", notes: "Notes"
    };
    return labels[name] || name;
  }

  function buildSummary(data, heading) {
    var lines = [heading || "RIDE WITH HR — TRANSPORT ENQUIRY", ""];
    ["service", "pickup", "destination", "date", "time", "passengers", "flight", "name", "email", "notes"].forEach(function (key) {
      var value = String(data.get(key) || "").trim();
      if (key === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        var parts = value.split("-");
        value = new Date(+parts[0], +parts[1] - 1, +parts[2]).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      }
      if (value) lines.push(labelFor(key) + ": " + value);
    });
    lines.push("", "This is an enquiry only. Journey, vehicle, price and availability require confirmation by H&R Transport.");
    return lines.join("\n");
  }

  if (form) {
    var serviceInput = form.querySelector("#service");
    var requestedService = new URLSearchParams(window.location.search).get("service");
    if (serviceInput && requestedService) {
      var hasRequestedService = Array.from(serviceInput.options).some(function (option) { return option.value === requestedService; });
      if (hasRequestedService) serviceInput.value = requestedService;
    }

    var dateInput = form.querySelector("#date");
    if (dateInput) {
      var today = new Date();
      var localDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
      dateInput.min = localDate;
    }

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

      status.textContent = "";
      var bookingEmail = config.business && config.business.email;
      var whatsapp = config.business && config.business.whatsapp;
      var mode = config.booking && config.booking.mode;

      // WhatsApp: open a chat with the enquiry typed in; the customer presses send.
      // A new tab keeps the site open on desktop; phones hand over to the WhatsApp app.
      if (mode === "whatsapp" && whatsapp) {
        var message = buildSummary(new FormData(form), "Hello Ride With HR, I'd like to arrange a journey:");
        var waUrl = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message);
        var waWindow = window.open(waUrl, "_blank");
        if (waWindow) waWindow.opener = null;
        else window.location.href = waUrl;
        status.classList.add("is-ok");
        status.textContent = "WhatsApp is opening with your details. Press send there to reach us.";
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
})();
