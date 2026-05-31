(function () {
  const $ = (s, p = document) => p.querySelector(s);
  const AUTH_KEY = "sto_admin_auth";

  let content = {};
  let password = "okean2026";

  async function loadConfig() {
    try {
      const r = await fetch("config.json", { cache: "no-store" });
      if (r.ok) {
        const c = await r.json();
        if (c.password) password = c.password;
      }
    } catch {
      /* config.example — скопируйте в config.json */
    }
  }

  async function loadContent() {
    const r = await fetch("../data/content.json", { cache: "no-store" });
    if (!r.ok) throw new Error("Не удалось загрузить content.json");
    content = await r.json();
  }

  function showMsg(el, text, ok) {
    el.textContent = text;
    el.className = "msg " + (ok ? "ok" : "err");
  }

  function field(label, id, value, type = "text") {
    const v = value == null ? "" : String(value);
    if (type === "textarea") {
      return `<label for="${id}">${label}</label><textarea id="${id}" name="${id}">${v.replace(/</g, "&lt;")}</textarea>`;
    }
    return `<label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${v.replace(/"/g, "&quot;")}" />`;
  }

  function itemBlock(prefix, item, i, fields) {
    const rows = fields
      .map((f) => field(f.label, `${prefix}_${i}_${f.key}`, item[f.key], f.type || "text"))
      .join("");
    return `<div class="item-card" data-prefix="${prefix}" data-index="${i}">${rows}
      <button type="button" class="btn btn-danger btn-sm-remove" data-prefix="${prefix}" data-index="${i}">Удалить</button></div>`;
  }

  function renderPanels() {
    const tabs = $("#tabs");
    const panels = $("#panels");
    const sections = [
      { id: "seo", title: "SEO и телефоны" },
      { id: "hero", title: "Главная" },
      { id: "services", title: "Услуги" },
      { id: "advantages", title: "Преимущества" },
      { id: "paint", title: "Краски" },
      { id: "about", title: "О нас" },
      { id: "faq", title: "FAQ" },
      { id: "reviews", title: "Отзывы" },
      { id: "other", title: "Запись и контакты" }
    ];

    tabs.innerHTML = sections.map((s, i) => `<button type="button" class="tab${i === 0 ? " on" : ""}" data-tab="${s.id}">${s.title}</button>`).join("");

    const p = content;
    const svc = p.sections?.services?.items || [];
    const adv = p.sections?.advantages?.items || [];
    const paintItems = p.sections?.paint?.items || [];
    const faq = p.sections?.faq?.items || [];
    const rev = p.sections?.reviews?.items || [];

    panels.innerHTML = `
      <div class="panel on" data-panel="seo">
        <div class="card">
          <h3>SEO</h3>
          ${field("Заголовок страницы (title)", "meta_title", p.meta?.title)}
          ${field("Описание (description)", "meta_description", p.meta?.description, "textarea")}
        </div>
        <div class="card">
          <h3>Телефоны</h3>
          <div class="row2">
            ${field("Сервис (цифры)", "phone_service", p.phones?.service)}
            ${field("Сервис (отображение)", "phone_service_display", p.phones?.serviceDisplay)}
          </div>
          <div class="row2">
            ${field("Краски (цифры)", "phone_paint", p.phones?.paint)}
            ${field("Краски (отображение)", "phone_paint_display", p.phones?.paintDisplay)}
          </div>
        </div>
      </div>

      <div class="panel" data-panel="hero">
        <div class="card">
          ${field("Подзаголовок H1", "hero_title", p.hero?.title)}
          ${field("Текст под заголовком", "hero_subtitle", p.hero?.subtitle, "textarea")}
          ${field("Бейджи (через запятую)", "hero_badges", (p.hero?.badges || []).join(", "))}
          <div id="heroBullets"></div>
          <button type="button" class="btn btn-ghost" id="addHeroBullet">+ Пункт «Почему мы»</button>
        </div>
      </div>

      <div class="panel" data-panel="services">
        <div class="card">
          ${field("Заголовок", "services_title", p.sections?.services?.title)}
          ${field("Подзаголовок", "services_subtitle", p.sections?.services?.subtitle, "textarea")}
          <div id="servicesItems"></div>
          <button type="button" class="btn btn-ghost" id="addService">+ Услуга</button>
        </div>
      </div>

      <div class="panel" data-panel="advantages">
        <div class="card">
          ${field("Заголовок", "adv_title", p.sections?.advantages?.title)}
          ${field("Подзаголовок", "adv_subtitle", p.sections?.advantages?.subtitle, "textarea")}
          <div id="advItems"></div>
          <button type="button" class="btn btn-ghost" id="addAdv">+ Преимущество</button>
        </div>
      </div>

      <div class="panel" data-panel="paint">
        <div class="card">
          ${field("Заголовок", "paint_title", p.sections?.paint?.title)}
          ${field("Подзаголовок", "paint_subtitle", p.sections?.paint?.subtitle, "textarea")}
          <div id="paintItems"></div>
          <button type="button" class="btn btn-ghost" id="addPaintItem">+ Карточка</button>
          <hr style="border-color:var(--line);margin:16px 0" />
          ${field("Баннер — заголовок", "paint_banner_title", p.sections?.paint?.bannerTitle)}
          ${field("Баннер — текст", "paint_banner_text", p.sections?.paint?.bannerText, "textarea")}
        </div>
      </div>

      <div class="panel" data-panel="about">
        <div class="card">
          ${field("Заголовок", "about_title", p.sections?.about?.title)}
          ${field("Абзац 1", "about_p1", p.sections?.about?.paragraphs?.[0], "textarea")}
          ${field("Абзац 2", "about_p2", p.sections?.about?.paragraphs?.[1], "textarea")}
          ${field("Адрес", "about_address", p.sections?.about?.address)}
        </div>
      </div>

      <div class="panel" data-panel="faq">
        <div class="card">
          ${field("Заголовок", "faq_title", p.sections?.faq?.title)}
          ${field("Подзаголовок", "faq_subtitle", p.sections?.faq?.subtitle, "textarea")}
          <div id="faqItems"></div>
          <button type="button" class="btn btn-ghost" id="addFaq">+ Вопрос</button>
        </div>
      </div>

      <div class="panel" data-panel="reviews">
        <div class="card">
          ${field("Заголовок", "reviews_title", p.sections?.reviews?.title)}
          <div id="reviewItems"></div>
          <button type="button" class="btn btn-ghost" id="addReview">+ Отзыв</button>
        </div>
      </div>

      <div class="panel" data-panel="other">
        <div class="card">
          ${field("Запись — заголовок", "booking_title", p.sections?.booking?.title)}
          ${field("Запись — подзаголовок", "booking_subtitle", p.sections?.booking?.subtitle, "textarea")}
          ${field("Контакты — заголовок", "contacts_title", p.sections?.contacts?.title)}
          ${field("Часы работы", "contacts_hours", p.sections?.contacts?.hours)}
        </div>
      </div>
    `;

    const hb = $("#heroBullets");
    hb.innerHTML = (p.hero?.bullets || [])
      .map((b, i) =>
        itemBlock("hero_bullet", b, i, [
          { key: "strong", label: "Жирный текст" },
          { key: "text", label: "Продолжение", type: "textarea" }
        ])
      )
      .join("");

    $("#servicesItems").innerHTML = svc
      .map((it, i) =>
        itemBlock("svc", it, i, [
          { key: "icon", label: "Иконка FontAwesome (fa-...)" },
          { key: "title", label: "Заголовок" },
          { key: "text", label: "Текст", type: "textarea" }
        ])
      )
      .join("");

    $("#advItems").innerHTML = adv
      .map((it, i) =>
        itemBlock("adv", it, i, [
          { key: "icon", label: "Иконка" },
          { key: "titleHighlight", label: "Выделение (необяз.)" },
          { key: "title", label: "Заголовок" },
          { key: "text", label: "Текст", type: "textarea" }
        ])
      )
      .join("");

    $("#paintItems").innerHTML = paintItems
      .map((it, i) =>
        itemBlock("paint", it, i, [
          { key: "icon", label: "Иконка" },
          { key: "title", label: "Заголовок" },
          { key: "text", label: "Текст", type: "textarea" }
        ])
      )
      .join("");

    $("#faqItems").innerHTML = faq
      .map((it, i) =>
        itemBlock("faq", it, i, [
          { key: "q", label: "Вопрос" },
          { key: "a", label: "Ответ", type: "textarea" }
        ])
      )
      .join("");

    $("#reviewItems").innerHTML = rev
      .map((it, i) =>
        itemBlock("rev", it, i, [
          { key: "author", label: "Имя" },
          { key: "text", label: "Текст отзыва", type: "textarea" }
        ])
      )
      .join("");

    bindTabs();
    bindDynamicButtons();
    bindRemove();
  }

  function bindTabs() {
    $$(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".tab").forEach((t) => t.classList.remove("on"));
        $$(".panel").forEach((p) => p.classList.remove("on"));
        btn.classList.add("on");
        $(`.panel[data-panel="${btn.dataset.tab}"]`)?.classList.add("on");
      });
    });
  }

  function $$(s, p = document) { return Array.from(p.querySelectorAll(s)); }

  function collectItems(prefix, keys) {
    const cards = $$(`.item-card[data-prefix="${prefix}"]`);
    return cards.map((card) => {
      const i = card.dataset.index;
      const o = {};
      keys.forEach((k) => {
        const el = $(`#${prefix}_${i}_${k.key}`, card) || $(`[name="${prefix}_${i}_${k.key}"]`, card);
        if (el) o[k.key] = el.value.trim();
      });
      return o;
    });
  }

  function collectForm() {
    const g = (id) => $(`#${id}`)?.value?.trim() || "";
    content = {
      meta: { title: g("meta_title"), description: g("meta_description") },
      phones: {
        service: g("phone_service"),
        serviceDisplay: g("phone_service_display"),
        paint: g("phone_paint"),
        paintDisplay: g("phone_paint_display")
      },
      hero: {
        badges: g("hero_badges").split(",").map((s) => s.trim()).filter(Boolean),
        title: g("hero_title"),
        subtitle: g("hero_subtitle"),
        bullets: collectItems("hero_bullet", [{ key: "strong" }, { key: "text" }])
      },
      sections: {
        services: {
          title: g("services_title"),
          subtitle: g("services_subtitle"),
          items: collectItems("svc", [{ key: "icon" }, { key: "title" }, { key: "text" }])
        },
        advantages: {
          title: g("adv_title"),
          subtitle: g("adv_subtitle"),
          items: collectItems("adv", [{ key: "icon" }, { key: "titleHighlight" }, { key: "title" }, { key: "text" }])
        },
        paint: {
          title: g("paint_title"),
          subtitle: g("paint_subtitle"),
          items: collectItems("paint", [{ key: "icon" }, { key: "title" }, { key: "text" }]),
          bannerTitle: g("paint_banner_title"),
          bannerText: g("paint_banner_text")
        },
        about: {
          title: g("about_title"),
          paragraphs: [g("about_p1"), g("about_p2")].filter(Boolean),
          address: g("about_address")
        },
        booking: { title: g("booking_title"), subtitle: g("booking_subtitle") },
        contacts: { title: g("contacts_title"), hours: g("contacts_hours") },
        faq: {
          title: g("faq_title"),
          subtitle: g("faq_subtitle"),
          items: collectItems("faq", [{ key: "q" }, { key: "a" }])
        },
        reviews: {
          title: g("reviews_title"),
          items: collectItems("rev", [{ key: "author" }, { key: "text" }])
        }
      }
    };
    return content;
  }

  function downloadJson() {
    collectForm();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function bindDynamicButtons() {
    $("#addHeroBullet")?.addEventListener("click", () => {
      content.hero = content.hero || {};
      content.hero.bullets = content.hero.bullets || [];
      content.hero.bullets.push({ strong: "Новый", text: "пункт" });
      renderPanels();
    });
    $("#addService")?.addEventListener("click", () => {
      content.sections.services.items.push({ icon: "fa-wrench", title: "Услуга", text: "Описание" });
      renderPanels();
      $(`.tab[data-tab="services"]`)?.click();
    });
    $("#addAdv")?.addEventListener("click", () => {
      content.sections.advantages.items.push({ icon: "fa-star", title: "Преимущество", text: "Текст" });
      renderPanels();
    });
    $("#addPaintItem")?.addEventListener("click", () => {
      content.sections.paint.items.push({ icon: "fa-palette", title: "Карточка", text: "Текст" });
      renderPanels();
    });
    $("#addFaq")?.addEventListener("click", () => {
      content.sections.faq.items.push({ q: "Вопрос?", a: "Ответ." });
      renderPanels();
    });
    $("#addReview")?.addEventListener("click", () => {
      content.sections.reviews.items.push({ author: "Клиент", text: "Отзыв" });
      renderPanels();
    });
  }

  function bindRemove() {
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-sm-remove");
      if (!btn) return;
      collectForm();
      const prefix = btn.dataset.prefix;
      const index = Number(btn.dataset.index);
      const map = {
        hero_bullet: () => content.hero.bullets.splice(index, 1),
        svc: () => content.sections.services.items.splice(index, 1),
        adv: () => content.sections.advantages.items.splice(index, 1),
        paint: () => content.sections.paint.items.splice(index, 1),
        faq: () => content.sections.faq.items.splice(index, 1),
        rev: () => content.sections.reviews.items.splice(index, 1)
      };
      map[prefix]?.();
      renderPanels();
    });
  }

  async function initApp() {
    await loadContent();
    renderPanels();
    $("#editorForm").addEventListener("submit", (e) => {
      e.preventDefault();
      downloadJson();
      showMsg($("#saveMsg"), "Файл content.json скачан. Загрузите его в папку data/ на GitHub.", true);
    });
    $("#reloadBtn").addEventListener("click", async () => {
      try {
        await loadContent();
        renderPanels();
        showMsg($("#saveMsg"), "Данные обновлены.", true);
      } catch {
        showMsg($("#saveMsg"), "Ошибка загрузки.", false);
      }
    });
    $("#logoutBtn").addEventListener("click", () => {
      sessionStorage.removeItem(AUTH_KEY);
      location.reload();
    });
  }

  async function init() {
    await loadConfig();
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      $("#loginView").classList.add("hidden");
      $("#appView").classList.remove("hidden");
      initApp();
      return;
    }
    $("#loginBtn").addEventListener("click", () => {
      if ($("#loginPass").value === password) {
        sessionStorage.setItem(AUTH_KEY, "1");
        $("#loginView").classList.add("hidden");
        $("#appView").classList.remove("hidden");
        initApp();
      } else {
        showMsg($("#loginMsg"), "Неверный пароль.", false);
      }
    });
  }

  init();
})();
