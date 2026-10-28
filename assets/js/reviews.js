/**
 * reviews.html: published guest reviews from the H&R app, the "Write a review" form,
 * and Tripadvisor once H&R has a listing (all set in content.js, `reviews`).
 * A review is the guest's own text, so it only ever goes into the page as text, never as HTML.
 */
(() => {
  const cfg = (window.RIDE_WITH_HR && window.RIDE_WITH_HR.reviews) || {};
  const $ = (sel) => document.querySelector(sel);
  const make = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => { if (k === "class") n.className = v; else n.setAttribute(k, v); });
    kids.flat().forEach((k) => { if (k != null) n.append(k); });
    return n;
  };
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
  const monthName = (ym) => {
    const [y, m] = String(ym || "").split("-").map(Number);
    return y && m ? new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : "";
  };

  // ---------------------------------------------------------------- published reviews
  const wall = $("[data-review-wall]");
  const summary = $("[data-review-summary]");
  const empty = $("[data-review-empty]");

  function showReviews(data) {
    const items = Array.isArray(data && data.items) ? data.items : [];
    wall.replaceChildren(...items.map((r) => {
      const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
      const meta = [r.journey, monthName(r.month)].filter(Boolean).join(" · ");
      return make("figure", { class: "review-card" },
        make("p", { class: "stars", "aria-label": `${rating} out of 5 stars` }, stars(rating)),
        make("blockquote", {}, String(r.text || "")),
        make("figcaption", {}, make("strong", {}, String(r.name || "")), meta ? ` · ${meta}` : ""));
    }));
    empty.hidden = items.length > 0;
    if (data && data.count > 0) {
      const avg = Number(data.average || 0).toFixed(1);
      summary.replaceChildren(make("span", { class: "stars", "aria-hidden": "true" }, stars(Math.round(data.average))),
        `${avg} out of 5 from ${data.count} ${data.count === 1 ? "review" : "reviews"}`);
      summary.hidden = false;
    }
  }

  if (cfg.api) {
    fetch(cfg.api, { credentials: "omit" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(showReviews)
      .catch(() => { empty.textContent = "Reviews couldn't load just now. Please try again later."; empty.hidden = false; });
  } else {
    empty.hidden = false;
  }

  // ---------------------------------------------------------------- write a review
  const form = $("[data-review-form]");
  const status = $("[data-review-status]");
  if (cfg.api) form.hidden = false; else $("[data-review-closed]").hidden = false;
  const shownAt = Date.now();

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    status.classList.remove("is-ok");
    const fd = new FormData(form);
    const say = (msg, field) => { status.textContent = msg; if (field) form.elements[field]?.focus?.(); };
    form.querySelectorAll("[aria-invalid]").forEach((n) => n.removeAttribute("aria-invalid"));
    const bad = (name, msg) => { const n = form.elements[name]; if (n && n.setAttribute) n.setAttribute("aria-invalid", "true"); say(msg, name === "rating" ? "star-5" : name); };
    const rating = Number(fd.get("rating"));
    const review = String(fd.get("review") || "").trim();
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!rating) { status.textContent = "Choose from 1 to 5 stars."; $("#star-5").focus(); return; }
    if (review.length < 10) return bad("review", "Write a few words about your journey.");
    if (!name) return bad("name", "Add the name to show with your review.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("email", "Add a valid email address. It's never shown.");
    if (!form.elements.consent.checked) return bad("consent", "Tick the box so we can show your review.");

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    say("Sending…");
    try {
      const res = await fetch(cfg.api, {
        method: "POST", credentials: "omit", headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ rating, review, name, email, journey: fd.get("journey") || "", consent: true, _honey: fd.get("_honey") || "", t: Date.now() - shownAt })
      });
      if (res.ok) {
        const thanks = make("div", { class: "review-thanks", role: "status" },
          make("h3", {}, "Thank you for your review."),
          make("p", {}, "We read every review before it appears on this page, so yours will show once we've checked it."));
        form.replaceWith(thanks);
        if (typeof window.gtag === "function") window.gtag("event", "review_sent", { rating });
        return;
      }
      const j = await res.json().catch(() => ({}));
      say(j.message || "Your review couldn't be sent. Please try again, or send it to us on WhatsApp.");
    } catch {
      say("Your review couldn't be sent. Check your connection and try again.");
    } finally {
      button.disabled = false;
    }
  });

  // ---------------------------------------------------------------- Tripadvisor
  // Shown only once H&R has a listing. The widget script comes from Tripadvisor's own
  // widget page (www.jscache.com); nothing else is loaded from there.
  if (cfg.tripadvisorUrl) {
    const box = $("[data-tripadvisor]");
    const read = $("[data-tripadvisor-read]");
    read.href = cfg.tripadvisorUrl;
    box.hidden = false;
    let src = null;
    try { src = cfg.tripadvisorWidget ? new URL(cfg.tripadvisorWidget) : null; } catch { src = null; }
    if (src && src.protocol === "https:" && src.hostname === "www.jscache.com") {
      const type = src.searchParams.get("wtype") || "selfserveprop";
      const uniq = src.searchParams.get("uniq") || "1";
      $("[data-tripadvisor-widget]").append(make("div", { id: `TA_${type}${uniq}`, class: `TA_${type}` },
        make("ul", { class: "TA_links" }, make("li", {}, make("a", { href: cfg.tripadvisorUrl, target: "_blank", rel: "noopener" }, "Tripadvisor")))));
      document.body.append(make("script", { src: src.href, async: "" }));
    }
  }
})();
