/* salt.design. Ванильный JS: плиты и «мягкий угол», план с тремя вариантами, видео-петли, меню, якоря, язык, форма в WhatsApp. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var LANG = "ru";
  var MOBILE = W.matchMedia("(max-width:760px)").matches;
  var TOUCH = W.matchMedia("(pointer:coarse)").matches;
  var VW = W.innerWidth, VH = W.innerHeight;

  /* ---------- WhatsApp: один номер, текст по ключу кнопки и языку ---------- */
  var PHONE = "77019982809";
  var WA = {
    ru: {
      "default": "Здравствуйте, Салтанат! Пишу с сайта salt.design. Хочу обсудить проект. Объект: ",
      hero: "Здравствуйте, Салтанат! Пишу с сайта salt.design. Хочу рассчитать дизайн-проект и ремонт. Объект (город, площадь): ",
      menu: "Здравствуйте, Салтанат! Пишу с сайта salt.design. Хочу обсудить проект. Объект: ",
      sticky: "Здравствуйте, Салтанат! Пишу с сайта salt.design. Хочу обсудить проект. Объект: ",
      kontakty: "Здравствуйте, Салтанат! Пишу с сайта salt.design. Хочу договориться о выезде на объект. Адрес и площадь: ",
      design: "Здравствуйте, Салтанат! Интересует дизайн-проект с визуализацией. Объект (город, площадь): ",
      rabochiy: "Здравствуйте, Салтанат! Интересует рабочий проект (чертежи). Объект (город, площадь): ",
      remont: "Здравствуйте, Салтанат! Интересует ремонт под ключ с гарантией. Объект (город, площадь, состояние): ",
      kompl: "Здравствуйте, Салтанат! Интересует комплектация объекта. Объект и стадия ремонта: ",
      nadzor: "Здравствуйте, Салтанат! Интересует авторский надзор. Объект и стадия ремонта: "
    },
    en: {
      "default": "Hello Saltanat! I am writing from salt.design. I would like to discuss a project. Property: ",
      hero: "Hello Saltanat! I am writing from salt.design. I would like a quote for interior design and renovation. Property (city, area): ",
      menu: "Hello Saltanat! I am writing from salt.design. I would like to discuss a project. Property: ",
      sticky: "Hello Saltanat! I am writing from salt.design. I would like to discuss a project. Property: ",
      kontakty: "Hello Saltanat! I am writing from salt.design. I would like to book a site visit. Address and area: ",
      design: "Hello Saltanat! I am interested in a design project with 3D visualisation. Property (city, area): ",
      rabochiy: "Hello Saltanat! I am interested in working drawings. Property (city, area): ",
      remont: "Hello Saltanat! I am interested in a turnkey renovation with a guarantee. Property (city, area, condition): ",
      kompl: "Hello Saltanat! I am interested in full furnishing and procurement. Property and renovation stage: ",
      nadzor: "Hello Saltanat! I am interested in designer supervision. Property and renovation stage: "
    }
  };
  var FORM_LABELS = {
    ru: { head: "Заявка с сайта salt.design", name: "Имя", phone: "Телефон", msg: "Объект" },
    en: { head: "Request from salt.design", name: "Name", phone: "Phone", msg: "Property" }
  };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var dict = WA[LANG] || WA.ru;
    var text = dict[key] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- Конверсии Google Ads: gtag подключается на этапе деплоя, здесь только вызовы ---------- */
  function fireConv(key) {
    if (typeof W.gtag_report_conversion !== "function" || !W.AW_CONV) return;
    var sendTo = W.AW_CONV[key];
    if (sendTo) W.gtag_report_conversion(undefined, sendTo);
  }
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"], a[href*="wa.me"]') : null;
    if (!a) return;
    fireConv(a.getAttribute("href").indexOf("tel:") === 0 ? "phone" : "contact");
  }, true);

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 340);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 72; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return (MOBILE || flowPlate(el)) ? r - HDR() : r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Плиты: enter / stay / exit; герой: --soft (угол) и --grow (окно во весь экран) ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;
  var st = pws.map(function () { return { open: -1, out: {} }; });
  var lastTs = 0;
  function put(el, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; el.style.setProperty(k, v); } }
  function flowPlate(pw) {
    var plate = pw.firstElementChild;
    return !plate || getComputedStyle(plate).position !== "sticky";
  }
  function update(ts) {
    ticking = false;
    var now = typeof ts === "number" ? ts : performance.now();
    var dt = lastTs ? Math.min(64, now - lastTs) : 16.7; lastTs = now;
    var k = 1 - Math.pow(1 - 0.16, dt / 16.7);
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    var moving = false;
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      if (!near && s.out["--enter"] !== undefined && !s.reset) { s.reset = true; } else if (near) s.reset = false;
      if (!near && s.reset) continue;
      var flow = flowPlate(pw);
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = (nxtTops[i] !== null && !flow) ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      var open;
      if (isHero) open = REDUCED ? 1 : smooth(INTRO);
      else open = REDUCED ? 1 : (flow ? smooth((enter - 0.2) / 0.5) : smooth((enter - 0.3) / 0.6));
      if (s.open < 0 || REDUCED || isHero) s.open = open;
      else {
        s.open += (open - s.open) * k;
        if (Math.abs(open - s.open) > 0.002) moving = true; else s.open = open;
      }
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", (isHero ? easeOut(stay) : stay).toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      put(pw, s, "--open", s.open.toFixed(4));
      var plate = pw.firstElementChild;
      if (isHero && plate) {
        /* десктоп: угол смягчается на интро, окно растёт по скроллу; мобайл: обе фазы на интро */
        var soft, grow;
        if (flow) { soft = smooth(INTRO / 0.62); grow = smooth((INTRO - 0.42) / 0.58); }
        else { soft = smooth(INTRO); grow = easeOut(stay); }
        if (REDUCED) { soft = 1; grow = 1; }
        put(plate, s, "--soft", soft.toFixed(4));
        put(plate, s, "--grow", grow.toFixed(4));
      }
      if (plate) plate.classList.toggle("gone", exit >= 1 && !flow);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt, .hero-txt");
      var on = isHero ? INTRO > 0.3 : (flow ? enter > 0.25 : enter > 0.6);
      if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
    if (moving) onScroll();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) { VW = W.innerWidth; VH = W.innerHeight; MOBILE = W.matchMedia("(max-width:760px)").matches; fitAll(); laneState(); }
    else if (!TOUCH) { VH = W.innerHeight; }
    onScroll();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1500);
    update(ts);
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Кадры каталожных секций: мягкий угол при появлении ---------- */
  var secPh = [].slice.call(doc.querySelectorAll(".sec .ph"));
  secPh.forEach(function (ph) { ph.style.setProperty("--open", REDUCED ? "1" : "0"); });
  function openPh(ph) {
    if (ph.getAttribute("data-done")) return;
    ph.setAttribute("data-done", "1");
    var t0 = 0;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = smooth((ts - t0) / 1300);
      ph.style.setProperty("--open", p.toFixed(4));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Подгонка дисплейных заголовков: кегль вниз шагом 5%, пока не влезает ---------- */
  var fits = [].slice.call(doc.querySelectorAll(".fit"));
  function fitOne(el) {
    el.style.fontSize = "";
    var base = parseFloat(getComputedStyle(el).fontSize), size = base, guard = 0;
    while (el.scrollWidth > el.clientWidth + 1 && guard < 12) { size *= 0.95; el.style.fontSize = size.toFixed(1) + "px"; guard++; }
  }
  function fitAll() { fits.forEach(fitOne); }

  /* ---------- Видео-петли: src подставляется по видимости, снимается вне экрана ---------- */
  var loops = [].slice.call(doc.querySelectorAll("video.loop"));
  function playLoop(v) {
    var ph = v.closest(".ph");
    if (!v.getAttribute("src")) {
      v.addEventListener("playing", function () { if (ph) ph.classList.add("is-live"); });
      v.setAttribute("src", v.getAttribute("data-src") + (ASSET_V ? "?v=" + ASSET_V : ""));
    }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function stopLoop(v) {
    var ph = v.closest(".ph");
    if (ph) ph.classList.remove("is-live");
    v.pause(); v.removeAttribute("src"); v.load();
  }
  if ("IntersectionObserver" in W && !REDUCED && loops.length) {
    var conn = navigator.connection;
    var saveData = conn && (conn.saveData || /2g/.test(conn.effectiveType || ""));
    if (!saveData) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) playLoop(x.target); else if (x.target.getAttribute("src")) stopLoop(x.target); });
      }, { threshold: 0.45 });
      loops.forEach(function (v) { vio.observe(v); });
    }
  }

  /* ---------- План: три варианта планировки, автосмена по видимости ---------- */
  var plan = doc.getElementById("plan");
  var planBtns = [].slice.call(doc.querySelectorAll(".plan-ctl button"));
  var planCur = 1, planTimer = null, planHold = 0, planVisible = false;
  function setPlan(n, manual) {
    planCur = n;
    if (plan) plan.setAttribute("class", "plan p" + n);
    planBtns.forEach(function (b) { var on = b.getAttribute("data-plan") === String(n); b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
    if (manual) planHold = Date.now() + 9000;
  }
  planBtns.forEach(function (b) { b.addEventListener("click", function () { setPlan(parseInt(b.getAttribute("data-plan"), 10), true); }); });
  function planTick() { if (planVisible && Date.now() > planHold && !REDUCED) setPlan(planCur % 3 + 1); }
  if (plan && "IntersectionObserver" in W) {
    new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        planVisible = x.isIntersecting;
        if (planVisible && !planTimer) planTimer = setInterval(planTick, 3200);
        if (!planVisible && planTimer) { clearInterval(planTimer); planTimer = null; }
      });
    }, { threshold: 0.4 }).observe(plan);
  }

  /* ---------- Галерея проектов: крупные кадры и «показать все» ---------- */
  var gal = doc.getElementById("gal"), galMore = doc.getElementById("galMore");
  function galLayout() {
    if (!gal) return;
    var all = gal.classList.contains("all"), i = 0;
    [].forEach.call(gal.children, function (li) {
      li.classList.remove("big", "rest");
      if (getComputedStyle(li).display === "none") return;
      if (i === 0 || i === 9) li.classList.add("big");
      if (!all && i >= 7) li.classList.add("rest");
      i++;
    });
    if (galMore) galMore.hidden = all || i <= 7;
  }
  if (gal) {
    galLayout();
    W.addEventListener("resize", galLayout);
    if (galMore) galMore.addEventListener("click", function () { gal.classList.add("all"); galLayout(); });
  }

  /* ---------- Мудборды: вкладки по санузлам ---------- */
  var mbTabs = [].slice.call(doc.querySelectorAll(".mb-tabs button"));
  mbTabs.forEach(function (b) {
    b.addEventListener("click", function () {
      mbTabs.forEach(function (x) {
        var on = x === b, panel = doc.getElementById("mbp" + x.getAttribute("data-mb"));
        x.classList.toggle("is-active", on); x.setAttribute("aria-selected", on ? "true" : "false");
        if (panel) panel.hidden = !on;
      });
    });
  });

  /* ---------- Ленты (проекты, комплектация): стрелки шагом в одну карточку ---------- */
  var laneFns = [];
  function laneState() { laneFns.forEach(function (f) { f(); }); }
  [].forEach.call(doc.querySelectorAll(".lane-wrap"), function (wrap) {
    var lane = wrap.querySelector(".lane"), lPrev = wrap.querySelector(".lane-btn.prev"), lNext = wrap.querySelector(".lane-btn.next");
    if (!lane || !lPrev || !lNext) return;
    function laneStep() {
      var card = [].filter.call(lane.children, function (c) { return c.offsetWidth > 0; })[0]; if (!card) return 320;
      var gap = parseFloat(getComputedStyle(lane).columnGap || getComputedStyle(lane).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function st() {
      var max = lane.scrollWidth - lane.clientWidth;
      var none = max <= 1;
      lPrev.hidden = none; lNext.hidden = none;
      lPrev.disabled = lane.scrollLeft <= 8;
      lNext.disabled = lane.scrollLeft >= max - 8;
    }
    lPrev.addEventListener("click", function () { lane.scrollBy({ left: -laneStep(), behavior: REDUCED ? "auto" : "smooth" }); });
    lNext.addEventListener("click", function () { lane.scrollBy({ left: laneStep(), behavior: REDUCED ? "auto" : "smooth" }); });
    lane.addEventListener("scroll", function () { requestAnimationFrame(st); }, { passive: true });
    laneFns.push(st); st();
  });


  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  I18N.en = {
    "meta.title": "Interior design and turnkey renovation in Astana\u00a0- salt.design, designer Saltanat",
    "meta.desc": "Design project with 3D visualisation from 15 000 ₸/m², working drawings from 5 000 ₸/m², turnkey renovation with a guarantee, designer supervision and full furnishing. Three layout options, staged payment for the design project, site visits in Astana.",
    "nav.design": "Design project", "nav.remont": "Renovation", "nav.kompl": "Furnishing", "nav.proj": "Projects", "nav.price": "Prices", "nav.kont": "Contacts", "nav.nadzor": "Supervision", "nav.about": "About",
    "tel.aria": "Call +7 701 998 28 09", "ig.aria": "salt.design on Instagram", "menu.aria": "Menu",
    "menu.note": "Astana, on-site work · Mon-Fri 9:00-18:00",
    "hero.kicker": "Astana · interior design · since 2022",
    "hero.t1": "Interior design", "hero.t2": "and turnkey renovation", "hero.t3": "in soft lines",
    "hero.lead": "Three layout options to choose from, drawings for every trade, renovation with a guarantee and full furnishing. <span class=\"m-hide\">One person is responsible for everything\u00a0- from the first measurement to the last vase.</span>",
    "hero.cta1": "Get a quote", "hero.cta2": "Services and prices", "hero.ig": "Projects and process on Instagram →",
    "plan.1": "Kitchen-living room", "plan.2": "Study and bedroom", "plan.3": "Walk-in closet", "room.k": "Kitchen", "room.l": "Living room", "room.kl": "Kitchen-living room", "room.b": "Bedroom", "room.s": "Study", "room.w": "Wardrobe", "room.c": "Bathroom",
    "design.kicker": "Design project", "design.h": "Design project with&nbsp;3D visualisation",
    "design.lead": "Three replanning and furniture layout options\u00a0- you pick yours. Then photorealistic visualisation and working drawings for every trade.",
    "design.l1": "Three layout options to choose from", "design.l2": "Visualisation of every room", "design.l3": "Drawings for the electrician, plumber and tiler",
    "design.price": "from&nbsp;15&nbsp;000&nbsp;₸/m²", "btn.price": "Get a price",
    "remont.kicker": "Turnkey renovation", "remont.h": "Turnkey renovation with&nbsp;a guarantee",
    "remont.lead": "Every stage from demolition to finishing\u00a0- with trusted contractors and suppliers.",
    "remont.l1": "Demolition, installation, replanning, masonry plan", "remont.l2": "Plumbing, heating, manifold units", "remont.l3": "Electrics, smart home, ventilation, heat recovery, air conditioning",
    "remont.price": "estimate after a site visit", "remont.alt": "Saltanat with contractors on site: mint walls ready for finishing and herringbone parquet", "remont.cap": "Site in Astana: finishing stage",
    "kompl.kicker": "Furnishing", "kompl.h": "Full furnishing and procurement",
    "kompl.lead": "Cabinet and upholstered furniture, lighting, plumbing fixtures, textiles and decor. I select them to the project and budget, order, receive and arrange\u00a0- you get a finished interior, not a shopping list.",
    "kompl.l1": "Estimate and mood board for every room", "kompl.l2": "Ordering and delivery control", "kompl.l3": "Receiving, arranging, styling",
    "kompl.price": "priced by project scope", "kompl.alt": "Armchair, TV area and decor selected for the project", "kompl.cap": "Living room: furniture, lighting and decor selected for the project",
    "nadzor.kicker": "Designer supervision", "nadzor.h": "Designer supervision on&nbsp;site",
    "nadzor.lead": "I control how the project is carried out at every stage: from engineering systems to finishing. No \"who cares what's behind the walls\".",
    "nadzor.l1": "Coordinating all specialists", "nadzor.l2": "Checking technical solutions", "nadzor.l3": "Drawings followed precisely",
    "nadzor.price": "from&nbsp;200&nbsp;000&nbsp;₸", "nadzor.alt": "Saltanat at the plumbing manifold explaining the pipework", "nadzor.cap": "Plumbing layout: checked before the walls are closed",
    "about.kicker": "About the designer", "about.h": "Saltanat. A designer who lives on&nbsp;the building site",
    "about.lead": "Not from an office with pretty renders, but from the site: dust, contractors, dozens of decisions a day. She writes the series \"Design without illusions\" about what designers keep quiet about.",
    "about.l1": "A designer sees what is hidden from the client", "about.l2": "A mistake at the rough stage means redoing the finish", "about.l3": "A designer is a strategist: turning construction chaos into a system", "about.l4": "The right contractors are half the success",
    "about.style": "Ethnic tradition, minimalism and modernity. Gentle. Fine. Precise.",
    "about.alt": "Saltanat, interior designer at salt.design, on a site at the rough stage", "about.alt2": "Bathroom in dark stone: photo from a completed project",
    "proj.kicker": "Projects", "proj.h": "Completed and ongoing projects", "proj.lead": "Apartments and houses: from ethnic accents to classics. The live process from the sites is on Instagram.",
    "lane.prev": "Previous", "lane.next": "Next", "pl.k": "Project visualisation",
    "proj.1": "Apartment", "proj.2": "Cottage", "proj.3": "Kitchen-living room", "proj.4": "Office", "proj.5": "Cafe", "proj.6": "Kids' room",
    "proj.ig": "More projects on Instagram", "proj.done": "Completed", "proj.wip": "In progress", "pt.g15": "Hallway with an ethnic accent", "pt.g27": "Bedroom", "pt.g23": "Marble bathroom", "pt.g46": "Living room", "pt.g25": "Walk-in wardrobe", "pt.g32": "Kitchen-dining room", "pt.g6": "Carved portal", "pt.g43": "Bedroom with a workspace", "pt.r5": "Kitchen with an island", "pt.r36": "Living room with a staircase", "pt.r13": "Dining room", "pt.r66": "Bedroom with ornament", "pt.r48": "Bathroom by the window", "pt.r17": "Hall", "pt.r28": "Living room", "pa.g15": "Hallway with a Kazakh chest and tus kiiz", "pa.g27": "Light bedroom with a chandelier and a soft headboard", "pa.g23": "Bathroom with a freestanding tub and marble walls", "pa.g46": "Living room with a velvet sofa", "pa.g25": "Walk-in wardrobe with glass fronts and lighting", "pa.g32": "Light kitchen-dining room with a chandelier", "pa.g6": "Dark blue carved portal between rooms, photo from the site", "pa.g43": "Bedroom with a desk by the window", "pa.r5": "Kitchen with a marble island and a crystal chandelier", "pa.r36": "Living and dining room with a staircase to the first floor", "pa.r13": "Dining room with a long table and two chandeliers", "pa.r66": "Bedroom with a rug with Kazakh ornament", "pa.r48": "Bathroom with a freestanding tub by the window", "pa.r17": "Hall with a stained glass door and a chandelier", "pa.r28": "Living room with green armchairs and a marble table", "draw.kicker": "Working drawings", "draw.h": "Drawings that builders follow without questions", "draw.lead": "Sheets from a real apartment project: every tradesman gets a drawing with dimensions and heights.", "dt.obmer": "Measured plan", "dt.montazh": "Partition layout", "dt.planirovka": "Floor plan with furniture", "dt.svet": "Lighting plan", "da.obmer": "Measured apartment plan with room areas", "da.montazh": "Partition layout plan with isometric views", "da.planirovka": "Floor plan with furniture layout", "da.svet": "Lighting and switch plan",
    "why.kicker": "Advantages", "why.h": "Why work with me?", "why.lead": "Because I keep the whole process under control\u00a0- from the first drawing to the final interior details. I coordinate, check, agree and make sure every participant works towards one result.",
    "why.alt": "Saltanat pointing at the concrete columns of a future living room", "why.t1": "Three layout options", "why.d1": "Replanning and furniture layout\u00a0- you choose from three.",
    "why.t2": "Guarantee on the renovation", "why.d2": "Set out in the contract: I answer for the result of the works, not just for the picture.",
    "why.t3": "Staged payment", "why.d3": "The design project is paid in stages.",
    "price.kicker": "Prices", "price.h": "What a project costs", "price.lead": "I calculate the exact cost after a site visit: area, condition of the property, scope of work.",
    "price.t1": "Working drawings", "price.p1": "from&nbsp;5&nbsp;000&nbsp;₸/m²", "price.d1": "Drawings for the trades: electrics, plumbing, partitions, ceilings, tiling.",
    "price.t2": "Design project with visualisation", "price.p2": "from&nbsp;15&nbsp;000&nbsp;₸/m²", "price.d2": "Three layout options, visualisation of every room and a full set of working drawings.",
    "price.t3": "Designer supervision", "price.p3": "from&nbsp;200&nbsp;000&nbsp;₸", "price.d3": "Site visits, control of the stages and detail decisions while the renovation is under way.",
    "price.note": "Turnkey renovation and furnishing are estimated after a site visit. The design project is paid in stages.",
    "how.kicker": "How we work", "how.h": "Four steps to&nbsp;a finished interior",
    "how.t1": "Request, site visit, consultation", "how.d1": "I look at the property, listen to how you live and estimate a budget range.",
    "how.t2": "Contract and measurements", "how.d2": "A measured plan and three layout options\u00a0- we approve one of the three.",
    "how.t3": "Design project", "how.d3": "Drawings and 3D visualisation of every room.",
    "how.t4": "Renovation, furnishing, handover", "how.d4": "Renovation with designer supervision, furnishing and handover of the finished interior.",
    "how.alt": "Saltanat in the arch of a future room on site",
    "kont.kicker": "Contacts", "kont.h": "Let's start with&nbsp;a site visit", "kont.lead": "Write on WhatsApp or leave your number: I will call back, clarify the task and suggest a time to meet on site.",
    "kont.ig": "Instagram salt.design",
    "kont.i1": "Astana, work at the client's property. Advertising and visits: Astana, Karaganda, Almaty, Ust-Kamenogorsk", "kont.i2": "Mon-Fri 9:00-18:00", "kont.i3": "Personal blog \"Design without illusions\":",
    "form.h": "Request a site visit", "form.name": "Name", "form.name.ph": "How should I address you", "form.phone": "Phone", "form.err": "Enter a phone number of at least 10 digits.",
    "form.msg": "About the property", "form.msg.ph": "78 m² apartment, new build, need a design project and renovation", "form.btn": "Send via WhatsApp", "form.note": "The request opens in WhatsApp with a ready text. I reply personally.",
    "thanks.h": "Thank you!", "thanks.p": "The request has gone to WhatsApp. I will reply during working hours, Mon-Fri 9:00-18:00.",
    "foot.tag": "Interior design and turnkey renovation, Astana", "sticky.call": "Call",
    "remont.l4": "Transparent purchasing of rough and finishing materials",
    "smeta.kicker": "Furnishing",
    "smeta.h": "How I estimate costs and&nbsp;choose materials",
    "smeta.lead": "For every room\u00a0- a mood board with the price of each item and the total. You see the budget before buying and compare options.",
    "smeta.t1": "Project estimate",
    "smeta.d1": "I count every item from the drawings: rough and finishing materials, furniture, lighting.",
    "smeta.t2": "Mood board per room",
    "smeta.d2": "Tiles, plumbing, fittings and colours on one sheet\u00a0- with the price of each item.",
    "smeta.t3": "Choosing between options",
    "smeta.d3": "Two furnishing options with a total. You approve before anything is ordered.",
    "smeta.t4": "Transparent purchasing",
    "smeta.d4": "I order from trusted suppliers, receive the goods and arrange them on site.",
    "mb.tag": "Mood board",
    "mb.1": "Guest bathroom, option 1",
    "mb.2": "Guest bathroom, option 2",
    "mb.3": "Men's bathroom, option 1",
    "mb.4": "Men's bathroom, option 2",
    "mb.5": "Master bathroom, option 1",
    "mb.6": "Master bathroom, option 2",
    "kp.tag": "Selected for the project",
    "kp.aria": "Mood boards and selections for the project",
    "proj.dp": "Design project",
    "pt.hall": "Hallway in soft lines",
    "pt.dining": "Dining room with a chandelier",
    "pa.hall": "Hallway with a soft curved wall and wood-look wardrobes",
    "pa.dining": "Dining room with a crystal chandelier, an arch and glass cabinets",
    "mba.1": "Mood board: guest bathroom, option 1, plumbing and colours with the price of each item",
    "mba.2": "Mood board: guest bathroom, option 2, plumbing and colours with the price of each item",
    "mba.3": "Mood board: men's bathroom, option 1, plumbing and colours with the price of each item",
    "mba.4": "Mood board: men's bathroom, option 2, plumbing and colours with the price of each item",
    "mba.5": "Mood board: master bathroom, option 1, plumbing and colours with the price of each item",
    "mba.6": "Mood board: master bathroom, option 2, plumbing and colours with the price of each item",
    "kt.vanity": "Vanity and sconces in the bathroom",
    "ka.vanity": "Dusty pink vanity with brass handles, framed mirror and sconces",
    "kt.wc": "Bathroom: fronts and chandelier",
    "ka.wc": "Powder pink fronts, marble niche and a glass chandelier in the bathroom",
    "kt.bath": "Bathtub by the window",
    "ka.bath": "Freestanding bathtub by the window with a brass mixer",
    "kt.bath2": "Bathroom with a tub",
    "ka.bath2": "Bathroom with a tub, vanity and a glass drop chandelier",
    "kt.armchair": "Armchair in the living room",
    "ka.armchair": "Green armchair with a wooden frame by the window",
    "kt.tvwall": "TV area",
    "ka.tvwall": "Wooden TV wall with shelves and lighting",
    "kt.ctable": "Coffee table",
    "ka.ctable": "Round table with a marble top by a leather sofa",
    "kt.desk": "Workspace by the window",
    "ka.desk": "Desk by the window, shelving and a table lamp",
    "kt.console": "Console and mirror",
    "ka.console": "Wooden console, antiqued mirror and a lamp",
    "kt.buffet": "Sideboard under the stairs",
    "ka.buffet": "Dark sideboard with porcelain and a lamp under the stairs",
    "kt.bench": "Bench in the hallway",
    "ka.bench": "Bench with floral upholstery and a burgundy radiator",
    "kt.kitchen": "Dining table in the kitchen",
    "ka.kitchen": "Wooden table and upholstered chairs in the kitchen",
    "remont.alt2": "Completed bathroom: marble, freestanding tub and lighting",
    "remont.cap2": "Completed project: marble bathroom",
    "mb.r1": "Guest bathroom",
    "mb.r2": "Men's bathroom",
    "mb.r3": "Master bathroom",
    "mb.v1": "Option 1",
    "mb.v2": "Option 2",
    "kp.h": "Selected for projects",
    "proj.more": "Show all projects",
    "btn.design": "Estimate the design project",
    "btn.remont": "Discuss the renovation",
    "btn.kompl": "Choose the furnishing",
    "btn.nadzor": "Book supervision",
    "btn.draw": "Order drawings",
    "why.real": "What it looks like in real life",
    "why.rc1": "Marble bathroom",
    "why.rc2": "Kitchen with an island",
    "why.rc3": "Doors and tiles in the hallway",
    "why.ra1": "Marble bathroom: photo from a completed project",
    "why.ra2": "Kitchen with an island: photo from a completed project",
    "why.ra3": "Entrance area with coloured doors: photo from a completed project"
  };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { var k = el.getAttribute("data-i"); if (RU[k] == null) RU[k] = el.innerHTML; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) el.innerHTML = v; });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("salt-lang", lang); } catch (e) {}
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitAll); else fitAll();
  }
  function loadLang(lang, done) {
    if (I18N[lang] || lang !== "kk") return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      if (W.SITE_KK) {
        I18N.kk = W.SITE_KK;
        if (W.SITE_KK_WA) WA.kk = W.SITE_KK_WA;
        if (W.SITE_KK_FORM) FORM_LABELS.kk = W.SITE_KK_FORM;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    /* ?lang= в адресе главнее сохранённого выбора: реклама ведёт на ?lang=ru */
    var forced = (location.search.match(/[?&]lang=(ru|kk|en)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("salt-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add("in");
        [].forEach.call(x.target.querySelectorAll(".ph"), openPh);
        io.unobserve(x.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) { el.classList.add("in"); [].forEach.call(el.querySelectorAll(".ph"), openPh); } }); }, 1500);
  } else { rv.forEach(function (el) { el.classList.add("in"); }); secPh.forEach(function (ph) { ph.style.setProperty("--open", "1"); }); }

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badPhone = phone.replace(/\D/g, "").length < 10;
      f.phone.classList.toggle("bad", badPhone);
      f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badPhone) { if (ferr) ferr.hidden = false; f.phone.focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head];
      if (name) lines.push(L.name + ": " + name);
      lines.push(L.phone + ": " + phone);
      var msg = f.msg.value.trim();
      if (msg) lines.push(L.msg + ": " + msg);
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n"));
      fireConv("form");
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }


  /* ---------- Старт ---------- */
  function start() {
    fitAll(); laneState();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitAll(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
