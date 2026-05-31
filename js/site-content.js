/**
 * Подгружает data/content.json и обновляет страницу.
 * HTML остаётся запасным вариантом, если JSON не загрузился.
 */
(function () {
  const root = document.getElementById("sto-root");
  if (!root) return;

  const esc = (s) => {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  };

  const tel = (n) => (n || "").replace(/\s/g, "");

  function applyPhones(p) {
    if (!p) return;
    root.querySelectorAll('[data-phone="service"]').forEach((el) => {
      if (el.tagName === "A") el.href = "tel:" + tel(p.service);
      el.textContent = p.serviceDisplay || p.service;
    });
    root.querySelectorAll('[data-phone="paint"]').forEach((el) => {
      if (el.tagName === "A") el.href = "tel:" + tel(p.paint);
      el.textContent = p.paintDisplay || p.paint;
    });
  }

  function applyMeta(m) {
    if (!m) return;
    if (m.title) document.title = m.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && m.description) desc.setAttribute("content", m.description);
  }

  function applyHero(h) {
    if (!h) return;
    const badges = root.querySelector("#home .badges");
    if (badges && h.badges) {
      badges.innerHTML = h.badges.map((b) => `<span class="badge">${esc(b)}</span>`).join("");
    }
    const titleLine = root.querySelector("#hero-title-line");
    if (titleLine && h.title) titleLine.textContent = h.title;
    const sub = root.querySelector("#hero-subtitle");
    if (sub && h.subtitle) sub.textContent = h.subtitle;
    const list = root.querySelector("#hero-bullets");
    if (list && h.bullets) {
      list.innerHTML = h.bullets
        .map(
          (b) =>
            `<div class="hero-item"><i class="fas fa-check-circle"></i><span><strong>${esc(b.strong)}</strong> ${esc(b.text)}</span></div>`
        )
        .join("");
    }
  }

  function renderCards(container, items, cardClass, withHighlight) {
    if (!container || !items) return;
    container.innerHTML = items
      .map((it) => {
        const title = withHighlight && it.titleHighlight
          ? `<h3><span class="highlight">${esc(it.titleHighlight)}</span> ${esc(it.title.replace(it.titleHighlight, "").trim())}</h3>`
          : `<h3>${esc(it.title)}</h3>`;
        return `<article class="card ${cardClass} reveal">
          <i class="fas ${esc(it.icon)}"></i>
          ${withHighlight ? `<div>${title}<p>${esc(it.text)}</p></div>` : `${title}<p>${esc(it.text)}</p>`}
        </article>`;
      })
      .join("");
  }

  function applySections(s, phones) {
    if (!s) return;

    const set = (id, title, sub) => {
      const t = root.querySelector("#" + id + "-title");
      const sb = root.querySelector("#" + id + "-subtitle");
      if (t && title) t.textContent = title;
      if (sb && sub) sb.textContent = sub;
    };

    if (s.services) {
      set("services", s.services.title, s.services.subtitle);
      renderCards(root.querySelector("#services-grid"), s.services.items, "service", false);
    }
    if (s.advantages) {
      set("advantages", s.advantages.title, s.advantages.subtitle);
      const grid = root.querySelector("#advantages-grid");
      if (grid && s.advantages.items) {
        grid.innerHTML = s.advantages.items
          .map((it) => {
            const title = it.titleHighlight
              ? `<h3><span class="highlight">${esc(it.titleHighlight)}</span>${esc(it.title.replace(it.titleHighlight, ""))}</h3>`
              : `<h3>${esc(it.title)}</h3>`;
            return `<article class="card adv reveal">
              <i class="fas ${esc(it.icon)}"></i>
              <div>${title}<p>${esc(it.text)}</p></div>
            </article>`;
          })
          .join("");
      }
    }
    if (s.paint) {
      set("paint", s.paint.title, s.paint.subtitle);
      renderCards(root.querySelector("#paint-grid"), s.paint.items, "paint-card", false);
      const bt = root.querySelector("#paint-banner-title");
      const bp = root.querySelector("#paint-banner-text");
      const ph = root.querySelector("#paint-banner-phone");
      if (bt && s.paint.bannerTitle) bt.textContent = s.paint.bannerTitle;
      if (bp && s.paint.bannerText) bp.textContent = s.paint.bannerText;
      if (ph && phones) ph.textContent = phones.paintDisplay || phones.paint;
    }
    if (s.about) {
      const at = root.querySelector("#about-title");
      if (at && s.about.title) at.textContent = s.about.title;
      const ap = root.querySelector("#about-text");
      if (ap && s.about.paragraphs) {
        ap.innerHTML = s.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
      }
      const aa = root.querySelector("#about-address");
      if (aa && s.about.address) {
        aa.innerHTML = '<strong style="color:var(--green2)">Адрес:</strong> ' + esc(s.about.address);
      }
    }
    if (s.booking) set("booking", s.booking.title, s.booking.subtitle);
    if (s.contacts) {
      const ct = root.querySelector("#contacts-title");
      if (ct && s.contacts.title) ct.textContent = s.contacts.title;
      const ch = root.querySelector("#contacts-hours");
      if (ch && s.contacts.hours) ch.textContent = s.contacts.hours;
    }
    if (s.faq) {
      set("faq", s.faq.title, s.faq.subtitle);
      const fl = root.querySelector("#faq-list");
      if (fl && s.faq.items) {
        fl.innerHTML = s.faq.items
          .map(
            (it) =>
              `<details class="faq-item"><summary>${esc(it.q)}</summary><p>${esc(it.a)}</p></details>`
          )
          .join("");
      }
    }
    if (s.reviews) {
      const rt = root.querySelector("#reviews-title");
      if (rt && s.reviews.title) rt.textContent = s.reviews.title;
      const track = root.querySelector("#stoRevTrack");
      const dots = root.querySelector("#stoDots");
      if (track && s.reviews.items) {
        track.innerHTML = s.reviews.items
          .map(
            (r) =>
              `<article class="rev"><div class="stars">★★★★★</div><p>«${esc(r.text)}»</p><div class="author">— ${esc(r.author)}</div></article>`
          )
          .join("");
        if (dots) {
          dots.innerHTML = s.reviews.items
            .map((_, i) => `<button class="dot${i === 0 ? " on" : ""}" type="button" aria-label="Отзыв ${i + 1}"></button>`)
            .join("");
        }
        document.dispatchEvent(new CustomEvent("sto:reviews-rebuilt"));
      }
    }
  }

  fetch("data/content.json", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error("no json");
      return r.json();
    })
    .then((data) => {
      applyMeta(data.meta);
      applyPhones(data.phones);
      applyHero(data.hero);
      applySections(data.sections, data.phones);
    })
    .catch(() => {});
})();
