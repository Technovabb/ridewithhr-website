/**
 * Reviews & Happy Moments (reviews.html) and its preview on the home page.
 * Everything here comes from the H&R app, and only once the office has published it:
 * guest reviews (featured ones first), their photos when the guest agreed, and the gallery
 * photos whose people agreed to be shown. A review is the guest's own text, so it only ever
 * goes into the page as text, never as HTML. Settings are in content.js (`reviews`).
 */
(() => {
  const cfg = (window.RIDE_WITH_HR && window.RIDE_WITH_HR.reviews) || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const make = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === "class") n.className = v; else if (k === "on") Object.entries(v).forEach(([e, f]) => n.addEventListener(e, f)); else n.setAttribute(k, v === true ? "" : v);
    });
    kids.flat().forEach((k) => { if (k != null && k !== false) n.append(k); });
    return n;
  };
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
  const monthName = (ym) => {
    const [y, m] = String(ym || "").split("-").map(Number);
    return y && m ? new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : "";
  };
  const getJson = (url) => fetch(url, { credentials: "omit" }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));
  const validReviews = (data) => (Array.isArray(data && data.items) ? data.items : []).filter((r) => Number(r.rating) >= 1 && Number(r.rating) <= 5);
  const guestName = (name) => String(name || "").trim();

  // ---------------------------------------------------------------- review cards
  function reviewCard(r) {
    const rating = Math.round(Number(r.rating));
    const meta = [r.journey, monthName(r.month)].filter(Boolean).join(" · ");
    return make("figure", { class: "rv-card" },
      r.photo ? make("div", { class: "rv-photo" }, make("img", { src: r.photo.url, alt: `Photo from ${guestName(r.name)}'s journey`, width: r.photo.width, height: r.photo.height, loading: "lazy", decoding: "async" })) : null,
      make("div", { class: "rv-body" },
        make("p", { class: "stars", "aria-label": `${rating} out of 5 stars` }, stars(rating)),
        make("blockquote", {}, String(r.text || "")),
        make("figcaption", { class: "rv-who" }, make("strong", {}, guestName(r.name)), meta ? ` · ${meta}` : ""),
        make("p", { class: "rv-source" }, "Guest review on ridewithhr.com")));
  }

  function featuredStory(r) {
    const rating = Math.round(Number(r.rating));
    return make("article", { class: "featured-story" },
      make("figure", {}, make("img", { src: r.photo.url, alt: `${guestName(r.name)} on their journey with H&R`, width: r.photo.width, height: r.photo.height, loading: "lazy", decoding: "async" })),
      make("div", { class: "story-copy" },
        make("p", { class: "stars", "aria-label": `${rating} out of 5 stars` }, stars(rating)),
        make("blockquote", {}, String(r.text || "")),
        make("p", { class: "story-meta" }, make("strong", {}, guestName(r.name)), [r.journey, monthName(r.month)].filter(Boolean).map((x) => ` · ${x}`).join(""))));
  }

  // ---------------------------------------------------------------- reviews page
  const wall = $("[data-review-wall]");
  if (wall) {
    const summary = $("[data-review-summary]");
    const empty = $("[data-review-empty]");
    const show = (data) => {
      const items = validReviews(data);
      const featured = items.filter((r) => r.featured && r.photo).slice(0, 3);
      if (featured.length) {
        $("[data-featured-list]").replaceChildren(...featured.map(featuredStory));
        $("[data-featured]").hidden = false;
      }
      wall.replaceChildren(...items.filter((r) => !featured.includes(r)).map(reviewCard));
      empty.hidden = items.length > 0;
      if (data && data.count > 0 && summary) {
        summary.replaceChildren(make("span", { class: "stars", "aria-hidden": "true" }, stars(Math.round(data.average))),
          `${Number(data.average || 0).toFixed(1)} out of 5 from ${data.count} ${data.count === 1 ? "review" : "reviews"}`);
        summary.hidden = false;
      }
    };
    if (cfg.api) getJson(cfg.api).then(show).catch(() => { $("[data-review-empty-text]").textContent = "Reviews couldn't load just now. Please try again later."; empty.hidden = false; });
    else empty.hidden = false;
  }

  // ---------------------------------------------------------------- the gallery and its viewer
  const box = $("[data-lightbox]");
  let shown = [], at = 0, lastFocus = null;
  function showAt(i) {
    at = (i + shown.length) % shown.length;
    const p = shown[at];
    const img = $("[data-lightbox-img]");
    img.src = p.url; img.alt = p.alt || ""; img.width = p.width; img.height = p.height;
    $("[data-lightbox-caption]").textContent = p.caption || "";
    $("[data-lightbox-count]").textContent = `${at + 1} / ${shown.length}`;
    const solo = shown.length < 2;
    $("[data-lightbox-prev]").hidden = solo; $("[data-lightbox-next]").hidden = solo;
  }
  function openViewer(list, i, from) {
    shown = list; lastFocus = from || document.activeElement; box.hidden = false; document.body.style.overflow = "hidden";
    showAt(i); $("[data-lightbox-close]").focus();
  }
  function closeViewer() { box.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  if (box) {
    $("[data-lightbox-close]").addEventListener("click", closeViewer);
    $("[data-lightbox-prev]").addEventListener("click", () => showAt(at - 1));
    $("[data-lightbox-next]").addEventListener("click", () => showAt(at + 1));
    box.addEventListener("click", (e) => { if (e.target === box) closeViewer(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") closeViewer();
      else if (e.key === "ArrowLeft") showAt(at - 1);
      else if (e.key === "ArrowRight") showAt(at + 1);
      else if (e.key === "Tab") {   // keep focus inside the viewer
        const f = [...box.querySelectorAll("button:not([hidden])")];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    let x0 = null;
    box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) showAt(at + (dx < 0 ? 1 : -1));
    });
    // share the gallery page, never a guest's photo address on its own
    $("[data-lightbox-share]").addEventListener("click", async (e) => {
      const url = `${location.origin}${location.pathname}#moments`;
      try {
        if (navigator.share) await navigator.share({ title: "Happy moments with H&R Executive Chauffeur Services", url });
        else { await navigator.clipboard.writeText(url); e.target.textContent = "Link copied"; setTimeout(() => { e.target.textContent = "Share"; }, 2000); }
      } catch { /* the guest closed the share sheet */ }
    });
  }

  const grid = $("[data-moments-grid]");
  if (grid) {
    const filters = $("[data-moments-filters]");
    const empty = $("[data-moments-empty]");
    let all = [], current = "";
    const tile = (p, i, list) => {
      const tall = p.height > p.width * 1.15;
      return make("button", { type: "button", class: `moment${p.featured ? " is-big" : tall ? " is-tall" : ""}`, "aria-label": `View photo: ${p.caption || p.alt}`,
        on: { click: (e) => openViewer(list, i, e.currentTarget) } },
      make("img", { src: p.url, alt: p.alt || "", width: p.width, height: p.height, loading: "lazy", decoding: "async" }), p.caption ? make("span", { "aria-hidden": "true" }, p.caption) : null);
    };
    const render = () => {
      const list = current ? all.filter((p) => p.category === current) : all;
      grid.replaceChildren(...list.map((p, i) => tile(p, i, list)));
      filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === current)));
    };
    const show = (data) => {
      all = Array.isArray(data && data.items) ? data.items : [];
      if (!all.length) { empty.hidden = false; return; }
      const cats = (data.categories || []).filter((c) => c.count > 0);   // only categories that have photos
      if (cats.length > 1) {
        filters.replaceChildren(...[{ id: "", label: "All Moments" }, ...cats].map((c) => make("button", { type: "button", "data-cat": c.id, "aria-pressed": "false",
          on: { click: () => { current = c.id; render(); } } }, c.label)));
        filters.hidden = false;
      }
      render();
    };
    if (cfg.gallery) getJson(cfg.gallery).then(show).catch(() => { empty.hidden = false; });
    else empty.hidden = false;
  }

  // ---------------------------------------------------------------- the home page preview
  const home = $("[data-home-moments]");
  if (home && (cfg.api || cfg.gallery)) {
    Promise.all([cfg.api ? getJson(cfg.api).catch(() => null) : null, cfg.gallery ? getJson(cfg.gallery).catch(() => null) : null]).then(([reviews, gallery]) => {
      const items = validReviews(reviews);
      const picks = [...items.filter((r) => r.featured), ...items.filter((r) => !r.featured)].slice(0, 3);
      const photos = (gallery && Array.isArray(gallery.items) ? gallery.items : []).slice(0, 6);
      if (!picks.length && !photos.length) return;   // nothing published yet: the section stays hidden
      $("[data-home-reviews]", home).replaceChildren(...picks.map(reviewCard));
      $("[data-home-photos]", home).replaceChildren(...photos.map((p) => make("a", { href: "reviews#moments", "aria-label": `See more moments: ${p.caption || p.alt}` },
        make("img", { src: p.url, alt: p.alt || "", width: p.width, height: p.height, loading: "lazy", decoding: "async" }))));
      home.hidden = false;
    });
  }

  // ---------------------------------------------------------------- share your experience
  const form = $("[data-review-form]");
  if (form) {
    const status = $("[data-review-status]");
    if (cfg.api) form.hidden = false; else $("[data-review-closed]").hidden = false;
    const shownAt = Date.now();
    let photo = null;
    const fileInput = form.elements.photo;
    const preview = $("[data-photo-preview]");
    const note = $("[data-photo-note]");
    const consentRow = $("[data-photo-consent-row]");
    const resetPhoto = (message) => {
      photo = null; fileInput.value = ""; preview.hidden = true; consentRow.hidden = true; form.elements.photoConsent.checked = false;
      note.textContent = message || "We make it smaller and remove its location details before it’s sent.";
    };

    // Redrawn at most 1600 pixels wide as WebP (or JPEG), which turns phone photos the right way up and
    // leaves their location and camera details behind. The H&R app checks and strips again.
    const shrink = async (file) => {
      let src;
      try { src = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch {
        const url = URL.createObjectURL(file);
        try { src = new Image(); src.src = url; await src.decode(); } finally { URL.revokeObjectURL(url); }
      }
      const sw = src.width || src.naturalWidth, sh = src.height || src.naturalHeight;
      const k = Math.min(1, 1600 / Math.max(sw, sh));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(sw * k)); c.height = Math.max(1, Math.round(sh * k));
      c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
      if (src.close) src.close();
      const toBlob = (type) => new Promise((res) => c.toBlob(res, type, 0.84));
      let blob = await toBlob("image/webp");
      if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg");
      if (!blob) throw new Error("prepare");
      const data = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(blob); });
      return { data, url: URL.createObjectURL(blob) };
    };
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return resetPhoto();
      if (file.size > 30 * 1024 * 1024) return resetPhoto("That photo is too big. Choose one under 30 MB.");
      note.textContent = "Preparing your photo…";
      try {
        photo = await shrink(file);
        $("[data-photo-img]").src = photo.url;
        preview.hidden = false; consentRow.hidden = false;
        note.textContent = "Ready. Its location details have been removed.";
      } catch { resetPhoto("This browser couldn't open that photo. Try a JPEG or PNG."); }
    });
    $("[data-photo-remove]").addEventListener("click", () => resetPhoto());

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const say = (msg, field) => { status.textContent = msg; if (field) form.elements[field]?.focus?.(); };
      form.querySelectorAll("[aria-invalid]").forEach((n) => n.removeAttribute("aria-invalid"));
      const bad = (name, msg) => { const n = form.elements[name]; if (n && n.setAttribute) n.setAttribute("aria-invalid", "true"); say(msg, name); };
      const rating = Number(fd.get("rating"));
      const review = String(fd.get("review") || "").trim();
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      if (!rating) { status.textContent = "Choose from 1 to 5 stars."; $("#star-5").focus(); return; }
      if (review.length < 10) return bad("review", "Write a few words about your journey.");
      if (!name) return bad("name", "Add the name to show with your review.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("email", "Add a valid email address. It's never shown.");
      if (photo && !form.elements.photoConsent.checked) return bad("photoConsent", "Tick the box to say everyone in the photo is happy to be shown, or remove the photo.");
      if (!form.elements.consent.checked) return bad("consent", "Tick the box so we can show your review.");

      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      say(photo ? "Sending your review and photo…" : "Sending…");
      try {
        const res = await fetch(cfg.api, {
          method: "POST", credentials: "omit", headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({ rating, review, name, email, journey: fd.get("journey") || "", consent: true, _honey: fd.get("_honey") || "", t: Date.now() - shownAt,
            ...(photo ? { photo: photo.data, photoConsent: true } : {}) })
        });
        if (res.ok) {
          form.replaceWith(make("div", { class: "review-thanks", role: "status" },
            make("h3", {}, "Thank you for sharing your experience."),
            make("p", {}, "We read every review before it appears on this page, so yours will show once we've checked it. Your email is never shown.")));
          if (typeof window.gtag === "function") window.gtag("event", "review_sent", { rating, photo: Boolean(photo) });
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
  }

  // ---------------------------------------------------------------- Tripadvisor
  // Shown only once H&R has a listing. The widget script comes from Tripadvisor's own
  // widget page (www.jscache.com); nothing else is loaded from there.
  const ta = $("[data-tripadvisor]");
  if (ta && cfg.tripadvisorUrl) {
    const read = $("[data-tripadvisor-read]");
    read.href = cfg.tripadvisorUrl;
    ta.hidden = false;
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
