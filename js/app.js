// =========================================================
// FERNANDO COSTA — v3 · estrutura
// Monta header, menu, landing e páginas de projeto a partir do dados.js
// =========================================================
const $ = (s, el = document) => el.querySelector(s);
const page = document.body.dataset.page;
const isHome = page === 'home';
const home = isHome ? '' : 'index.html';
const link = (slug) => `projeto.html?p=${slug}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// lista "achatada" de projetos de uma seção, na ordem do menu
const flat = (sec) => sec.grupos.flatMap((g) => g.projetos.map((slug) => ({ slug, grupo: g, secao: sec })));
const all = SECOES.flatMap(flat);
const findProj = (slug) => all.find((x) => x.slug === slug);

// ---------- 1. HEADER (tarja vermelha) + MENU EM LISTA ----------
function buildHeader() {
  const menus = SECOES.map((sec) => {
    let n = 0;
    const cols = sec.grupos.map((g) => `
      <div class="menu__col">
        ${g.nome ? `<a class="menu__group mono" href="${home}#${g.id}">${esc(g.nome)}</a>` : `<span class="menu__group menu__group--blank mono">PROJETOS</span>`}
        <ul>${g.projetos.map((slug) => {
          const p = PROJETOS[slug]; n++;
          return `<li><a href="${link(slug)}"><span class="mono">${String(n).padStart(2, '0')}</span><strong>${esc(p.cliente)}</strong><em>${esc(p.titulo)}</em></a></li>`;
        }).join('')}</ul>
      </div>`).join('');
    return `<div class="menu" id="menu-${sec.id}" hidden>
      <div class="menu__inner">
        <a class="menu__title" href="${home}#${sec.id}">${sec.nome} <span class="mono">VER TUDO ↓</span></a>
        <div class="menu__cols">${cols}</div>
      </div>
    </div>`;
  }).join('');

  $('#header').outerHTML = `
  <header class="bar" id="bar">
    <a href="${home}#inicio" class="bar__brand">FERNANDO COSTA<span class="mono">FILMMAKER | FOTÓGRAFO</span></a>
    <span class="bar__now mono"><b></b><span class="bar__rec">REC</span><span class="bar__tc" id="tc" aria-hidden="true">00:00:00:00</span><span id="now">INÍCIO</span></span>
    <nav class="bar__nav mono" aria-label="Navegação principal">
      <a href="${home}#inicio">INÍCIO</a>
      <button data-menu="video" aria-expanded="false">VÍDEO <i>+</i></button>
      <button data-menu="foto" aria-expanded="false">FOTO <i>+</i></button>
      <a href="${home}#sobre">SOBRE</a>
    </nav>
  </header>
  ${menus}
  <div class="menu-backdrop" id="menuBackdrop" hidden></div>`;
}

function setupMenus() {
  const backdrop = $('#menuBackdrop');
  const close = () => {
    document.querySelectorAll('.menu').forEach((m) => { m.hidden = true; });
    document.querySelectorAll('[data-menu]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    backdrop.hidden = true;
  };
  document.querySelectorAll('[data-menu]').forEach((btn) => btn.addEventListener('click', () => {
    const menu = $(`#menu-${btn.dataset.menu}`);
    const open = menu.hidden;
    close();
    if (open) { menu.hidden = false; backdrop.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  }));
  backdrop.addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.querySelectorAll('.menu a').forEach((a) => a.addEventListener('click', close));
}

// ---------- 2. LANDING: o rolo único ----------
function card(slug, variant) {
  const p = PROJETOS[slug];
  const media = p.tipo === 'foto' ? 'FOTO' : 'VÍDEO';
  return `<a class="card card--${variant} reveal" href="${link(slug)}">
    <div class="card__media"><span class="mono">${media}</span>${p.tipo === 'video' ? '<i class="card__play"></i>' : ''}</div>
    <span class="kicker mono">${esc(p.cliente)}</span>
    <h4>${esc(p.titulo)}</h4>
    <p>${esc(p.resumo)}</p>
  </a>`;
}

function buildRoll() {
  $('#roll').outerHTML = SECOES.map((sec, si) => {
    let gi = 0;
    const groups = sec.grupos.map((g) => {
      const variant = g.destaque ? 'big' : sec.id === 'foto' ? 'photo' : g.projetos.length >= 4 ? 'small' : 'mid';
      const label = g.nome ? `<div class="group__head reveal"><span class="mono">${si + 1}.${++gi}</span><h3>${esc(g.nome)}</h3></div>` : '';
      return `<div class="group" id="${g.id}">${label}
        <div class="cards cards--${variant}">${g.projetos.map((s) => card(s, variant)).join('')}</div>
      </div>`;
    }).join('');
    return `<section class="sec sec--${sec.id}" id="${sec.id}" data-now="${sec.nome}">
      <header class="sec__head reveal"><span class="mono">0${si + 1}</span><h2>${sec.nome}</h2></header>
      ${groups}
    </section>`;
  }).join('');
}

// ---------- 3. PÁGINA DE PROJETO ----------
// Transforma o link colado no dados.js no endereço do player.
// Aceita: vimeo.com/123, vimeo.com/123/abc (não listado), só o número,
// youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID.
function embedUrl(link) {
  const s = String(link || '').trim();
  if (!s) return '';
  let m;
  if ((m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([\w-]{11})/))) {
    return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&playsinline=1`;
  }
  if ((m = s.match(/(?:vimeo\.com\/(?:video\/)?)?(\d{6,})(?:\/([\da-f]+))?/))) {
    return `https://player.vimeo.com/video/${m[1]}?${m[2] ? `h=${m[2]}&` : ''}title=0&byline=0&portrait=0`;
  }
  return '';
}

// arquivo de vídeo direto no site (ex.: 'assets/videos/monk-evento.mp4')
const isFile = (l) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(l || '').trim());

function vimeo(link, cls, label, poster, foco) {
  if (isFile(link)) {
    return `<div class="${cls} is-file"><video src="${esc(String(link).trim())}" controls playsinline preload="metadata"${poster ? ` poster="${esc(poster)}"` : ''} title="${esc(label)}"></video></div>`;
  }
  const src = embedUrl(link);
  // YouTube: embaixo do player vai um link para assistir lá (garantia, caso o player não carregue)
  const yt = (String(link).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([\w-]{11})/) || [])[1];
  const ytLink = yt ? `<a class="yt-link mono" href="https://www.youtube.com/watch?v=${yt}" target="_blank" rel="noopener">Assistir no YouTube ↗</a>` : '';
  // capa própria (sem lettering) por cima do player: o vídeo só carrega no clique
  if (src && poster) {
    const auto = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
    return `<div class="${cls} has-poster"><button type="button" class="poster" data-src="${esc(auto)}" aria-label="Assistir: ${esc(label)}"><img src="${esc(poster)}" alt=""${foco ? ` style="object-position:${esc(foco)}"` : ''}><span class="poster__play" aria-hidden="true"></span></button></div>${ytLink}`;
  }
  return src
    ? `<div class="${cls}"><iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" title="${esc(label)}"></iframe></div>${ytLink}`
    : `<div class="${cls} is-empty"><span class="mono">${esc(label)}</span></div>`;
}

function buildProject() {
  const slug = new URLSearchParams(location.search).get('p') || all[0].slug;
  const ref = findProj(slug);
  const p = PROJETOS[slug];
  if (!ref || !p) { $('#projeto').innerHTML = '<p class="notfound mono">PROJETO NÃO ENCONTRADO</p>'; return; }
  document.title = `${p.cliente} — ${p.titulo} | Fernando Costa`;
  // descrição da página para o Google e para o compartilhamento (WhatsApp, LinkedIn)
  const desc = !provisorio(p.resumo) ? p.resumo : `${p.cliente} — ${p.titulo}. Fernando Costa, filmmaker e fotógrafo.`;
  document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach((m) => m.setAttribute('content', desc));
  document.querySelectorAll('meta[property="og:title"]').forEach((m) => m.setAttribute('content', document.title));

  const list = flat(ref.secao);
  const i = list.findIndex((x) => x.slug === slug);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];

  const fotos = Array.isArray(p.fotos) ? p.fotos : [];
  const pos = p.foco ? ` style="object-position:${p.foco}"` : "";
  // capa em tela cheia: fotos, e vídeos que só têm peças verticais (sem vídeo principal horizontal)
  const capaImg = p.tipo === 'foto' ? fotos[0] : p.thumb;
  const capa = `<header class="pcover">
        ${capaImg ? `<img src="${capaImg}" alt=""${pos}>` : ''}
        <div class="pcover__body"><span>${esc(p.cliente)}</span><strong>${esc(p.titulo)}</strong></div>
      </header>`;
  const soVertical = p.tipo === 'video' && !p.videoPrincipal && p.thumb && (p.sociais || []).some(Boolean);
  const media = p.tipo === 'video' && !soVertical
    ? vimeo(p.videoPrincipal, 'player', p.titulo || 'Vídeo principal',
        p.poster || (p.thumb && !/^https?:/.test(p.thumb) ? p.thumb : ''), p.focoPoster || p.foco)
    : p.tipo === 'foto' ? '' : capa; // fotos: sem capa grande, a página abre no título e segue para a galeria

  // galeria de arte: todas as fotos, de 2 em 2, cada uma num quadro do mesmo tamanho (foto inteira, sem corte)
  const gfotos = fotos;
  const gallery = gfotos.map((src, k) =>
    `<button class="gitem g-art reveal" data-i="${k}" aria-label="Ver foto ${k + 1} em tela cheia"><img src="${src}" alt="${esc(p.cliente)} — foto ${k + 1}" loading="lazy"></button>`).join('');

  // outros vídeos horizontais da campanha (ex.: NewSpace)
  const outros = (p.outrosVideos || []).length
    ? `<section class="more">
        <div class="socials__head reveal"><h3>Outros vídeos da campanha</h3><span>${p.outrosVideos.length} vídeos · 16:9</span></div>
        ${[...new Set(p.outrosVideos.map((v) => v.grupo || ''))].map((gname) => `
          ${gname ? `<h4 class="cast__name reveal">${esc(gname)}</h4>` : ''}
          <div class="more__grid">${p.outrosVideos.filter((v) => (v.grupo || '') === gname).map((v) => `<figure class="reveal">${vimeo(v.link, 'player', v.titulo)}<figcaption>${esc(v.titulo)}</figcaption></figure>`).join('')}</div>`).join('')}
      </section>`
    : '';
  const sociais = (p.sociais || []).length
    ? `<section class="socials">
        <div class="socials__head reveal"><h3>${p.videoPrincipal ? "VÍDEOS PARA REDES SOCIAIS" : (p.sociais.length > 1 ? "Vídeos" : "Vídeo")}</h3><span class="mono">${p.sociais.length > 1 ? p.sociais.length + " PEÇAS · " : ""}9:16</span></div>
        <div class="socials__grid">${p.sociais.map((id, k) => `<div class="reveal">${vimeo(id, 'vertical', `REELS ${String(k + 1).padStart(2, '0')}`, isFile(id) ? (p.capasSociais || [])[k] : '')}</div>`).join('')}</div>
      </section>`
    : '';
  // cortes para redes agrupados por personagem (ex.: Natura) — sempre em segundo plano, menores
  const pers = (p.personagens || []).filter((g) => (g.cortes || []).some(Boolean));
  const personagens = pers.length
    ? `<section class="socials socials--sec">
        <div class="socials__head reveal"><h3>Cortes para redes sociais</h3><span class="mono">${pers.length} ${pers.length > 1 ? 'PERSONAGENS' : 'PERSONAGEM'} · 9:16</span></div>
        ${pers.map((g) => `
          <div class="cast reveal">
            <h4 class="cast__name">${esc(g.nome)}</h4>
            <div class="socials__grid">${g.cortes.filter(Boolean).map((id, k) => `<div>${vimeo(id, 'vertical', `${g.nome} — corte ${k + 1}`)}</div>`).join('')}</div>
          </div>`).join('')}
      </section>`
    : '';
  const extra = p.tipo === 'video'
    ? outros + personagens + (p.videoPrincipal ? sociais.replace('class="socials"', 'class="socials socials--sec"') : sociais)
    : `<section class="gallery2 is-art">${gallery}</section>`;

  const process = (p.extras || p.ferramentas) ? `
    <section class="process">
      ${(p.extras || []).map((b, k) => `
        <div class="process__block reveal">
          <span class="mono">${String(k + 1).padStart(2, '0')}</span>
          <h3>${esc(b.titulo)}</h3>
          <p>${esc(b.texto)}</p>
        </div>`).join('')}
      ${p.ferramentas ? `
        <div class="tools reveal">
          <span class="mono tools__label">FERRAMENTAS</span>
          <ul>${p.ferramentas.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        </div>` : ''}
    </section>` : '';

  $('#projeto').innerHTML = `
    <nav class="crumbs mono" aria-label="Você está em">
      <a href="index.html#${ref.secao.id}">${ref.secao.nome}</a><span>/</span>
      ${ref.grupo.nome ? `<a href="index.html#${ref.grupo.id}">${esc(ref.grupo.nome)}</a><span>/</span>` : ''}
      <strong>${esc(p.cliente)}</strong>
    </nav>
    ${media}
    ${p.tipo === 'video' ? extra : ''}
    <section class="info">
      <div class="info__title reveal">
        <span class="kicker mono">${esc(p.cliente)}</span>
        <h1>${esc(p.titulo)}</h1>
      </div>
      <div class="info__text reveal">
        ${provisorio(p.texto) ? '' : `<p>${esc(p.texto)}</p>`}
        <ul class="roles mono">${p.funcoes.filter((f) => !provisorio(f)).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
    </section>
    ${process}
    ${p.tipo === 'video' ? '' : extra}
    <nav class="pager">
      <a href="${link(prev.slug)}" class="pager__prev"><span class="mono">← ANTERIOR</span><strong>${esc(PROJETOS[prev.slug].cliente)}</strong><em>${esc(PROJETOS[prev.slug].titulo)}</em></a>
      <a href="${link(next.slug)}" class="pager__next"><span class="mono">PRÓXIMO →</span><strong>${esc(PROJETOS[next.slug].cliente)}</strong><em>${esc(PROJETOS[next.slug].titulo)}</em></a>
    </nav>`;
  $('#now').textContent = ref.secao.nome;
  if (p.tipo === 'foto') { document.body.classList.add('is-photo'); setupLightbox(gfotos, p.cliente); }
  else if (soVertical) document.body.classList.add('is-photo'); // mesma capa em tela cheia das fotos
}

// ---------- 3b. FOTO EM TELA CHEIA (setas, teclado, arrastar no celular) ----------
function setupLightbox(fotos, nome) {
  if (!fotos.length) return;
  const box = document.createElement('div');
  box.className = 'lbox'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', `Fotos — ${nome}`);
  box.innerHTML = `<img class="lbox__img" alt="">
    <button class="lbox__btn lbox__prev" aria-label="Foto anterior">‹</button>
    <button class="lbox__btn lbox__next" aria-label="Próxima foto">›</button>
    <button class="lbox__close" aria-label="Fechar">Fechar</button>
    <span class="lbox__count"></span>`;
  document.body.appendChild(box);
  const img = $('.lbox__img', box), count = $('.lbox__count', box);
  let i = 0, lastFocus = null;
  const show = (n) => {
    i = (n + fotos.length) % fotos.length;
    img.src = fotos[i]; img.alt = `${nome} — foto ${i + 1}`;
    count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(fotos.length).padStart(2, '0')}`;
  };
  const open = (n) => { lastFocus = document.activeElement; show(n); box.hidden = false; document.body.style.overflow = 'hidden'; $('.lbox__close', box).focus(); };
  const close = () => { box.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
  document.querySelectorAll('.gitem[data-i]').forEach((b) => b.addEventListener('click', () => open(+b.dataset.i)));
  $('.lbox__prev', box).addEventListener('click', () => show(i - 1));
  $('.lbox__next', box).addEventListener('click', () => show(i + 1));
  $('.lbox__close', box).addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  let x0 = null; // arrastar no celular
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// ---------- 4. Seção atual na tarja (landing) ----------
function trackSection() {
  const targets = [['INÍCIO', '#inicio'], ...SECOES.map((s) => [s.nome, `#${s.id}`]), ['SOBRE', '#sobre']];
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) $('#now').textContent = e.target.dataset.nowLabel;
  }), { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach(([label, sel]) => { const el = $(sel); el.dataset.nowLabel = label; io.observe(el); });
}

// ---------- 5. Conteúdo surgindo no scroll ----------
function reveal() {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => {
    const sib = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    if (sib.length > 1) el.style.transitionDelay = `${Math.min(sib.indexOf(el), 5) * 80}ms`;
    io.observe(el);
  });
}

// ---------- INICIALIZAÇÃO ----------
buildHeader();
if ($('#roll')) { buildRoll(); trackSection(); } else if ($('#projeto')) { buildProject(); }
setupMenus();
reveal();
// ao chegar com #âncora vindo de outra página, rola até ela depois de montar
if (isHome && location.hash) {
  const t = document.getElementById(location.hash.slice(1));
  if (t) { t.scrollIntoView({ behavior: 'instant' }); addEventListener('load', () => t.scrollIntoView({ behavior: 'instant' }), { once: true }); }
}

// ---------- 6. TIMECODE DE CÂMERA NA TARJA ----------
// Roda em 24 quadros por segundo, como uma câmera gravando; quanto mais rápido
// a pessoa rola a página, mais o timecode acelera (até ~40x).
(function timecode() {
  const el = document.getElementById('tc');
  if (!el) return;
  const FPS = 24, pad = (n) => String(n).padStart(2, '0');
  let frames = 0, last = performance.now(), lastY = scrollY, speed = 1;
  function tick(now) {
    const dt = Math.min(100, now - last); last = now;
    const v = Math.abs(scrollY - lastY) / Math.max(dt, 1); lastY = scrollY; // px por ms
    speed += ((1 + Math.min(v * 14, 40)) - speed) * 0.12;                   // acelera e desacelera suave
    frames += (dt / 1000) * FPS * speed;
    const f = Math.floor(frames), s = Math.floor(f / FPS);
    el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % FPS)}`;
    el.classList.toggle('is-fast', speed > 4);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// clique na capa própria: troca pela iframe do vídeo já tocando
document.addEventListener('click', (e) => {
  const b = e.target.closest('.poster[data-src]');
  if (!b) return;
  const f = document.createElement('iframe');
  f.src = b.dataset.src;
  f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  f.allowFullscreen = true;
  f.referrerPolicy = 'strict-origin-when-cross-origin'; // o YouTube exige saber de qual site veio
  f.title = b.getAttribute('aria-label') || 'Vídeo';
  b.replaceWith(f);
});

// endereço do vídeo como "fundo": sem som, sem controles, em loop (para as prévias)
function bgSrc(link) {
  const s = String(link || '').trim();
  let m;
  if ((m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/)) || (m = s.match(/^(\d{6,})$/)))
    return `https://player.vimeo.com/video/${m[1]}?background=1&autoplay=1&loop=1&muted=1`;
  if ((m = s.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)))
    return `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${m[1]}&playsinline=1&modestbranding=1&rel=0`;
  return '';
}

// textos ainda não preenchidos (entre colchetes, ex.: '[Texto sobre...]') não aparecem no site
function provisorio(t) { return !t || /^\s*\[/.test(String(t)); }
