// Andreea · estado en vivo (hora de Madrid), escaparate bilingüe, enlaces de WhatsApp, menú y entrada.
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lang = () => root.lang || 'es';
  const pick = (m) => m[lang()] ?? m.es;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Horario (Google, consultado el 20-11-2026) ----------
  // 0 = domingo … 6 = sábado; [abre, cierra] en horas
  const HOURS = { 0: [10, 17], 1: null, 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [10, 20] };
  const DAYS = {
    es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    ro: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
    ca: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte']
  };
  const TX = {
    open: { es: (c) => `Abierto ahora · cerramos a las ${c}`, ro: (c) => `Deschis acum · închidem la ${c}`, ca: (c) => `Obert ara · tanquem a les ${c}` },
    today: { es: (o) => `Cerrado · abrimos hoy a las ${o}`, ro: (o) => `Închis · deschidem azi la ${o}`, ca: (o) => `Tancat · obrim avui a les ${o}` },
    tomorrow: { es: (o) => `Cerrado · abrimos mañana a las ${o}`, ro: (o) => `Închis · deschidem mâine la ${o}`, ca: (o) => `Tancat · obrim demà a les ${o}` },
    later: { es: (o, d) => `Cerrado · abrimos el ${d} a las ${o}`, ro: (o, d) => `Închis · deschidem ${d} la ${o}`, ca: (o, d) => `Tancat · obrim ${d} a les ${o}` },
    todayTag: { es: 'Hoy', ro: 'Azi', ca: 'Avui' }
  };
  const hh = (h) => String(h).padStart(2, '0') + ':00';
  function madridNow() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    return { d: wd, m: Number(p.hour) * 60 + Number(p.minute) };
  }
  function status() {
    const { d, m } = madridNow();
    const L = lang();
    const el = $('#status'), txt = $('#status-txt');
    const h = HOURS[d];
    let s, open = false;
    if (h && m >= h[0] * 60 && m < h[1] * 60) { open = true; s = TX.open[L](hh(h[1])); }
    else if (h && m < h[0] * 60) s = TX.today[L](hh(h[0]));
    else {
      for (let k = 1; k <= 7; k++) {
        const nd = (d + k) % 7, nh = HOURS[nd];
        if (!nh) continue;
        s = k === 1 ? TX.tomorrow[L](hh(nh[0])) : TX.later[L](hh(nh[0]), DAYS[L][nd]);
        break;
      }
    }
    if (el && txt) { txt.textContent = s; el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open); }
    $$('.hours tr').forEach((tr) => {
      const on = Number(tr.dataset.d) === d;
      tr.classList.toggle('is-today', on);
      const th = tr.querySelector('th');
      if (on) th.dataset.today = TX.todayTag[L]; else delete th.dataset.today;
    });
  }

  // ---------- WhatsApp: un mensaje ya escrito, en el idioma de la página ----------
  const WA = '34663898785';
  const MSG = {
    general: { es: 'Hola, os escribo desde la web de Andreea.', ro: 'Bună ziua! Vă scriu de pe site-ul magazinului Andreea.', ca: 'Hola, us escric des del web d’Andreea.' },
    food: { es: 'Hola, ¿qué comida casera tenéis hoy?', ro: 'Bună ziua! Ce mâncare gătită aveți azi?', ca: 'Hola, quin menjar casolà teniu avui?' },
    cakes: { es: 'Hola, ¿qué pasteles tenéis hoy?', ro: 'Bună ziua! Ce prăjituri aveți azi?', ca: 'Hola, quins pastissos teniu avui?' }
  };
  function waLinks() {
    $$('[data-wa]').forEach((a) => { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(pick(MSG[a.dataset.wa] || MSG.general))}`; });
  }

  // ---------- El escaparate: rumano a la izquierda, tu idioma a la derecha, la foto en el eje ----------
  const WIN = [
    { f: 'carnati-2', w: 2000, h: 2323, pos: '50% 50%', alt: { es: 'Ristras de cârnați envasados sobre un tejido rumano rojo, blanco y negro', ro: 'Cârnați ambalați pe un țesut românesc roșu, alb și negru', ca: 'Ristres de cârnați envasats sobre un teixit romanès vermell, blanc i negre' } },
    { f: 'carnati', w: 2000, h: 2667, pos: '50% 45%', alt: { es: 'Cârnați y embutidos ahumados envasados, con etiqueta roja', ro: 'Cârnați și afumături ambalate, cu etichetă roșie', ca: 'Cârnați i embotits fumats envasats, amb etiqueta vermella' } },
    { f: 'branzeturi', w: 2000, h: 2667, pos: '50% 50%', alt: { es: 'Tarrinas de queso fundido apiladas en la tienda', ro: 'Cutii de brânză topită așezate în magazin', ca: 'Terrines de formatge fos apilades a la botiga' } },
    { f: 'covrigi', w: 960, h: 812, pos: '22% 50%', alt: { es: 'Covrigi, chicharrones, ahumados y una bebida rumana sobre el tejido de la tienda', ro: 'Covrigi, jumări, afumături și o băutură românească pe țesutul magazinului', ca: 'Covrigi, llardons, fumats i una beguda romanesa sobre el teixit de la botiga' } },
    { f: 'legume', w: 2000, h: 2107, pos: '40% 50%', alt: { es: 'Cajas de pimientos, pepinos, tomates y ciruelas', ro: 'Lăzi cu ardei, castraveți, roșii și prune', ca: 'Caixes de pebrots, cogombres, tomàquets i prunes' } },
    { f: 'raft', w: 2000, h: 1125, pos: '38% 50%', big: 1400, small: 900, alt: { es: 'Pasillo de la tienda con estanterías de productos rumanos y cajas de bebidas', ro: 'Culoarul magazinului cu rafturi de produse românești și baxuri de băuturi', ca: 'Passadís de la botiga amb prestatgeries de productes romanesos i caixes de begudes' } }
  ];
  const srcs = (it) => {
    const s = it.small || 640, b = it.big || (it.f === 'covrigi' ? 960 : 1000);
    return { src: `assets/img/${it.f}-${s}.webp`, srcset: `assets/img/${it.f}-${s}.webp ${s}w, assets/img/${it.f}-${b}.webp ${b}w` };
  };
  let cur = 0;
  const frame = $('.win-photo');
  function setImgAttrs(img, it) {
    const s = srcs(it);
    img.srcset = s.srcset; img.src = s.src; img.width = it.w; img.height = it.h;
    img.sizes = '(min-width: 900px) 30vw, 80vw';
    img.style.objectPosition = it.pos; img.alt = pick(it.alt); img.dataset.k = WIN.indexOf(it);
  }
  function show(k, force) {
    if (!frame || (k === cur && !force)) return;
    cur = k;
    $$('.win-loc button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.k) === k)));
    $$('.win-ro li').forEach((li) => li.classList.toggle('is-on', Number(li.dataset.k) === k));
    const img = new Image();
    img.className = 'win-img';
    img.decoding = 'async';
    setImgAttrs(img, WIN[k]);
    const put = () => {
      if (cur !== k) return;
      if (!reduce) img.classList.add('is-new');
      frame.appendChild(img);
      const clean = () => $$('.win-img', frame).forEach((o) => { if (o !== img) o.remove(); });
      if (reduce) clean(); else { img.addEventListener('animationend', clean, { once: true }); setTimeout(clean, 1200); }
    };
    if (img.complete) put(); else { img.onload = put; img.onerror = put; }
  }
  $$('.win-loc button').forEach((b) => {
    b.addEventListener('click', () => show(Number(b.dataset.k)));
    b.addEventListener('focus', () => show(Number(b.dataset.k)));
  });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.win-loc button, .win-ro li').forEach((el) => el.addEventListener('pointerenter', () => show(Number(el.dataset.k))));
  }
  // precarga discreta de las fotos del escaparate cuando la sección se acerca
  if (frame && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { io.disconnect(); WIN.forEach((it) => { const i = new Image(); const s = srcs(it); i.srcset = s.srcset; i.sizes = '(min-width: 900px) 30vw, 80vw'; i.src = s.src; }); }
    }, { rootMargin: '600px 0px' });
    io.observe(frame);
  }
  const first = $('.win-img'); if (first) first.style.objectPosition = WIN[0].pos;

  // ---------- Menú del móvil ----------
  const btn = $('#menu-btn'), menu = $('#menu');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    root.style.overflow = open ? 'hidden' : '';
  }
  btn?.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); } });
  matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // ---------- Cabecera con línea al bajar ----------
  const head = $('#head'), top = $('.topbar');
  if (head && top && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => head.classList.toggle('is-stuck', !e.isIntersecting)).observe(top);
  }

  // ---------- Entrada: el titular sube y la fachada se abre desde el eje, como su puerta ----------
  const heroImg = $('.door img');
  let entered = false;
  const enter = () => { if (entered) return; entered = true; void root.offsetWidth; root.classList.add('is-in'); };
  Promise.race([
    Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), heroImg && heroImg.decode ? heroImg.decode().catch(() => {}) : Promise.resolve()]),
    new Promise((r) => setTimeout(r, 1600))
  ]).then(enter);
  setTimeout(enter, 2500);

  // ---------- Idioma ----------
  document.addEventListener('langchange', () => {
    status(); waLinks();
    $$('.win-img').forEach((img) => { const it = WIN[Number(img.dataset.k)]; if (it) img.alt = pick(it.alt); });
  });
  status(); waLinks();
  setInterval(status, 60000);
})();
