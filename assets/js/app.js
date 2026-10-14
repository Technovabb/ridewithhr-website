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

  function buildSummary(data) {
    var lines = ["RIDE WITH HR — TRANSPORT ENQUIRY", ""];
    ["service", "pickup", "destination", "date", "time", "passengers", "flight", "name", "email", "notes"].forEach(function (key) {
      var value = String(data.get(key) || "").trim();
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
      var summary = buildSummary(new FormData(form));
      var bookingEmail = config.business && config.business.email;
      var mode = config.booking && config.booking.mode;

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
