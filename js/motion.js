// =========================================================
// v4 · MOTION
// =========================================================
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// textura de granulado gerada uma vez (bem mais leve que filtro SVG animado)
(function grain() {
  const c = document.createElement('canvas'); c.width = c.height = 180;
  const g = c.getContext('2d'); const img = g.createImageData(180, 180);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  document.documentElement.style.setProperty('--grain', `url(${c.toDataURL()})`);
})();

// ---------- 0. CURSOR VISOR (quadradinho de câmera) ----------
(function viewfinder() {
  if (!fine) return;
  const c = document.createElement('div');
  c.className = 'cursor'; c.setAttribute('aria-hidden', 'true');
  c.innerHTML = '<i></i><i></i><i></i><i></i><span>Play</span>';
  document.body.appendChild(c);
  document.body.classList.add('has-cursor');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    c.classList.toggle('is-play', !!e.target.closest('.tile, .reel'));
  });
  (function loop() {
    cx = lerp(cx, mx, 0.22); cy = lerp(cy, my, 0.22);
    c.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
})();

// ---------- 1. ABERTURA: O NOME — TRÊS EXEMPLOS PARA TESTAR ----------
//  meio-tom  → grade de bolinhas; o tamanho de cada uma desenha o nome. O mouse é uma lente
//              que aumenta os pontos e os transforma em losangos.
//  magnetico → bolinhas coloridas chegam voando com rastros e formam o nome, como num ímã.
//  estrelas  → primeira versão: partículas com brilho e faíscas.
// O seletor embaixo do nome troca entre eles (só para teste). Também dá para usar
// ?abertura=meio-tom | magnetico | estrelas no endereço.
const ABERTURAS = ['sutil', 'meio-tom', 'magnetico', 'estrelas'];
const NOMES_ABERTURA = { sutil: 'Sutil', 'meio-tom': 'Meio-tom', magnetico: 'Magnético', estrelas: 'Estrelas' };

(function hero() {
  const canvas = document.getElementById('dust');
  const ctx = canvas.getContext('2d');
  const reel = document.querySelector('.dust__reel');
  const sec = document.getElementById('inicio');
  const shade = document.querySelector('.dust__shade');
  const PAL = ['#FF4937', '#3D5BFF', '#F4C3AE', '#EDE6DE', '#ff8a3d', '#7A1408'];
  let W, H, DPR, mask = null, items = [], mode, start = 0;
  const mouse = { x: -9999, y: -9999 };

  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } return null; };
  const PADRAO = (typeof ABERTURA_PADRAO !== 'undefined' && ABERTURA_PADRAO) || 'meio-tom';
  const SELETOR = typeof MOSTRAR_SELETOR === 'undefined' ? true : MOSTRAR_SELETOR;
  // com o seletor escondido (site no ar), vale sempre a abertura escolhida no dados.js
  mode = new URLSearchParams(location.search).get('abertura') || (SELETOR && store('abertura-v2')) || PADRAO;
  // 'video' = só o showreel, sem o nome grande no meio da abertura
  if (!ABERTURAS.includes(mode) && mode !== 'video') mode = 'meio-tom';

  // seletor de teste
  const sw = document.createElement('div');
  sw.className = 'hero-switch';
  sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', 'Exemplos de abertura');
  sw.innerHTML = ABERTURAS.map((m) => `<button type="button" data-m="${m}">${NOMES_ABERTURA[m]}</button>`).join('');
  if (SELETOR) sec.appendChild(sw);
  sw.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setMode(b.dataset.m); });

  // desenha o nome escondido e guarda os pixels (a "máscara")
  function makeMask() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const o = off.getContext('2d');
    const heavy = mode !== 'estrelas';
    const size = W < 720 ? W * 0.25 : Math.min(W * (heavy ? 0.14 : 0.13), H * 0.28);
    o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle';
    let fs = size;
    o.font = `${heavy ? 700 : 300} ${fs}px "Hanken Grotesk", sans-serif`;
    // garante que o nome cabe em 90% da largura
    const fit = (W * 0.9) / o.measureText(W < 720 ? "Fernando" : "Fernando Costa").width;
    if (fit < 1) { fs *= fit; o.font = `${heavy ? 700 : 300} ${fs}px "Hanken Grotesk", sans-serif`; }
    if (W < 720) { o.fillText('Fernando', W / 2, H * 0.42); o.fillText("Costa", W / 2, H * 0.42 + fs * 0.95); }
    else o.fillText('Fernando Costa', W / 2, H * 0.48);
    mask = o.getImageData(0, 0, W, H).data;
  }
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : mask[((y | 0) * W + (x | 0)) * 4 + 3] / 255;

  // ---- construtores de cada exemplo ----
  function buildHalftone() {
    const cell = W < 720 ? 9 : 12;
    items = [];
    for (let y = cell / 2; y < H; y += cell) for (let x = cell / 2; x < W; x += cell) {
      const q = cell * 0.3; // cobertura média de 5 amostras dentro da célula
      const cov = (alphaAt(x, y) + alphaAt(x - q, y - q) + alphaAt(x + q, y - q) + alphaAt(x - q, y + q) + alphaAt(x + q, y + q)) / 5;
      items.push({ x, y, cov, cur: 0, cell });
    }
  }

  function sampleParticles(max) {
    let step = 2;
    const count = (s) => { let c = 0; for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) if (alphaAt(x, y) > 0.5) c++; return c; };
    while (count(step) > max && step < 16) step++;
    const out = [];
    for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (alphaAt(x, y) > 0.5) out.push({ hx: x, hy: y, step });
    return out;
  }

  function buildMagnetic() {
    items = sampleParticles(W < 720 ? 700 : 1600).map((p) => {
      const side = Math.random() * 4 | 0; // nascem fora da tela, de um lado qualquer
      const x = side === 0 ? -40 : side === 1 ? W + 40 : Math.random() * W;
      const y = side === 2 ? -40 : side === 3 ? H + 40 : Math.random() * H;
      return { ...p, x, y, vx: 0, vy: 0, r: p.step * (0.38 + Math.random() * 0.22), c: PAL[Math.random() * PAL.length | 0], delay: Math.random() * 900 };
    });
  }

  function buildStars() {
    items = sampleParticles(W < 720 ? 2500 : 5000).map((p) => ({
      ...p, x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0,
      r: Math.random() * 1.2 + 1, tw: Math.random() * Math.PI * 2, ember: Math.random() < 0.18,
      drift: { x: (Math.random() - 0.5) * 2, y: -Math.random() * 1.6 - 0.2 },
    }));
  }

  // abertura "sutil": o nome em texto branco (HTML), letras surgindo devagar e respirando
  const soft = document.createElement('p');
  soft.className = 'hero-soft'; soft.setAttribute('aria-hidden', 'true');
  soft.innerHTML = ['Fernando', 'Costa'].map((w) => `<span class="hero-soft__w">${[...w].map((ch, k) => `<i style="--k:${k}">${ch}</i>`).join('')}</span>`).join(' ');
  sec.appendChild(soft);

  function build() {
    soft.classList.toggle('is-on', mode === 'sutil');
    canvas.style.display = (mode === 'sutil' || mode === 'video') ? 'none' : '';
    if (mode === 'video') { items = []; return; }   // só o vídeo, sem nome
    if (mode !== 'sutil') makeMask(); // o "Sutil" é texto, não precisa medir o desenho escondido
    if (mode === 'sutil') { items = []; soft.classList.remove('is-in'); void soft.offsetWidth; soft.classList.add('is-in'); }
    else if (mode === 'meio-tom') buildHalftone(); else if (mode === 'magnetico') buildMagnetic(); else buildStars();
    start = performance.now();
    sw.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === mode)));
  }
  function setMode(m) { mode = m; store('abertura-v2', m); build(); }

  // repulsão do mouse (exemplos com partículas)
  function push(p, R2, k) {
    const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
    if (d2 < R2) { const f = (R2 - d2) / R2; p.vx += dx * f * k; p.vy += dy * f * k; }
  }

  // ---- desenho de cada exemplo ----
  function drawHalftone(t, s) {
    ctx.fillStyle = '#EDE6DE';
    const L = 150;
    for (const c of items) {
      const dx = c.x - mouse.x, dy = c.y - mouse.y;
      const lens = Math.exp(-(dx * dx + dy * dy) / (2 * L * L));
      // tamanho = cobertura + onda suave + lente do mouse; o scroll esvazia a grade
      const wave = 0.12 * Math.sin(t * 0.0025 + c.x * 0.015 + c.y * 0.01);
      let target = c.cov * (1 + wave) + lens * (0.25 + c.cov * 0.5);
      target *= 1 - s;
      c.cur = lerp(c.cur, target, 0.14);
      const r = c.cur * c.cell * 0.5;
      if (r < 0.35) { ctx.globalAlpha = 0.18; ctx.fillRect(c.x - 0.5, c.y - 0.5, 1, 1); continue; }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      if (lens > 0.35) { // perto do mouse: losango
        const q = r * 1.15;
        ctx.moveTo(c.x, c.y - q); ctx.lineTo(c.x + q, c.y); ctx.lineTo(c.x, c.y + q); ctx.lineTo(c.x - q, c.y);
      } else {
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawMagnetic(t, s) {
    const el = t - start;
    for (const p of items) {
      const on = el > p.delay ? 1 : 0;
      const tx = p.hx + (p.hx - W / 2) * s * 1.2, ty = p.hy - s * H * 0.5;
      push(p, 14000, 0.09);
      p.vx += (tx - p.x) * 0.02 * on; p.vy += (ty - p.y) * 0.02 * on;
      p.vx *= 0.9; p.vy *= 0.9;
      p.x += p.vx; p.y += p.vy;
      const sp = Math.hypot(p.vx, p.vy);
      ctx.globalAlpha = 1 - s * 0.8;
      if (sp > 1.2) { // rastro de linha enquanto se move
        ctx.strokeStyle = p.c; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 9, p.y - p.vy * 9); ctx.stroke();
      }
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawStars(t, s) {
    for (const p of items) {
      const tx = p.hx + p.drift.x * s * W * 0.45, ty = p.hy + p.drift.y * s * H * 0.6;
      push(p, 9000, 0.06);
      p.vx += (tx - p.x) * 0.045; p.vy += (ty - p.y) * 0.045;
      p.vx *= 0.82; p.vy *= 0.82;
      p.x += p.vx; p.y += p.vy;
      const glint = 0.75 + 0.25 * Math.sin(t * 0.004 + p.tw);
      const a = (1 - s * 0.85) * glint;
      ctx.fillStyle = p.ember ? `rgba(255,73,55,${a})` : `rgba(237,230,222,${a})`;
      ctx.fillRect(p.x, p.y, p.r, p.r);
      if (glint > 0.995 && !p.ember) {
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(p.x - 2, p.y, p.r + 4, 0.6); ctx.fillRect(p.x, p.y - 2, 0.6, p.r + 4);
      }
    }
  }

  function frame(t) {
    const s = clamp(scrollY / (sec.offsetHeight * 0.75));
    // vídeo de compilação sempre visível em tela cheia; o véu escuro diminui ao rolar
    reel.style.opacity = 1; shade.style.opacity = (1 - s * 0.7).toFixed(2);
    ctx.clearRect(0, 0, W, H);
    if (mode === 'video') { /* só o vídeo */ }
    else if (mode === 'sutil') soft.style.setProperty('--s', s.toFixed(3)); // ao rolar: letras se afastam e somem
    else if (mode === 'meio-tom') drawHalftone(t, s); else if (mode === 'magnetico') drawMagnetic(t, s); else drawStars(t, s);
    if (!reduce) requestAnimationFrame(frame);
  }

  sec.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  sec.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  addEventListener('resize', build);
  Promise.all([document.fonts.load('300 100px "Hanken Grotesk"'), document.fonts.load('700 100px "Hanken Grotesk"'), document.fonts.ready]).then(() => {
    build();
    if (reduce) items.forEach((p) => { if ('hx' in p) { p.x = p.hx; p.y = p.hy; } });
    requestAnimationFrame(frame);
  });
  if (reduce) addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
})();

// ---------- 2. PALAVRAS QUE TROCAM COM DESFOQUE (como no começo) ----------
(function words() {
  const sec = document.getElementById('words');
  const items = [...document.querySelectorAll('#wordsList li')];
  const glow = document.getElementById('wordsGlow');
  if (!sec || !items.length || reduce) return;
  function update() {
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight));
    const idx = p * (items.length - 1);
    items.forEach((li, i) => {
      const d = i - idx, ad = Math.abs(d);
      li.style.transform = `translateY(${d * 62}%) scale(${1 - Math.min(ad, 1) * 0.08})`;
      li.style.filter = `blur(${Math.min(ad * 14, 22)}px)`;
      li.style.opacity = clamp(1 - ad * 0.75, 0, 1);
    });
    if (glow) glow.style.setProperty('--r', `${30 + p * 70}%`);
  }
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  update();
})();

// ---------- 3. PROJETOS (a partir do dados.js) ----------
(function projects() {
  const HOT = [['#3D5BFF', '#FF4937'], ['#FF4937', '#7A1408'], ['#3D5BFF', '#9fb3ff'], ['#ff8a3d', '#3D5BFF'], ['#FF4937', '#ffd1c4']];
  const WARM = [['#b9a99a', '#7a6a5c'], ['#e8ddd2', '#a08f80'], ['#c7b6a6', '#ffffff']];
  const rnd = (a, b) => `${Math.round(a + Math.random() * (b - a))}%`;

  // com thumb: mostra a imagem; sem thumb: brilho provisório
  function media(p, pal) {
    if (p.thumb) return `<img class="tile__img" src="${p.thumb}" alt="" loading="lazy"${p.foco ? ` style="object-position:${p.foco}"` : ""}>`;
    const [c1, c2] = pal[Math.floor(Math.random() * pal.length)];
    return `<span class="tile__heat" style="--c1:${c1};--c2:${c2};--x1:${rnd(15, 55)};--y1:${rnd(20, 70)};--x2:${rnd(45, 85)};--y2:${rnd(30, 80)};--d:-${(Math.random() * 9).toFixed(1)}s"></span>`;
  }

  function build(secId, gridId, pal) {
    const sec = SECOES.find((s) => s.id === secId);
    let k = 0;
    document.getElementById(gridId).innerHTML = sec.grupos.map((g) => g.projetos.map((slug, i) => {
      const p = PROJETOS[slug];
      const big = ' tile--hero'; k++;                   // todos os projetos ocupam a largura toda
      const anchor = i === 0 ? ` id="${g.id}"` : '';  // para os links do menu
      const tag = g.id === 'ia' ? '<em class="tile__tag">Criação com IA</em>' : '';
      return `<a${anchor} class="tile${big}" href="projeto.html?p=${slug}">${media(p, pal)}${tag}
        <span class="tile__name">${p.cliente}<small>${p.titulo}</small>${secId === 'video' && p.resumo && !provisorio(p.resumo) ? `<span class="tile__desc">${p.resumo}</span>` : ''}</span></a>`;
    }).join('')).join('');
  }
  build('video', 'videoGrid', HOT);
  build('foto', 'fotoGrid', WARM);

  // índice de projetos nas capas de Vídeo e Foto (para pular direto)
  document.querySelectorAll('[data-index]').forEach((nav) => {
    const sec = SECOES.find((s) => s.id === nav.dataset.index);
    nav.innerHTML = '<span>Projetos</span><ol>' + sec.grupos.flatMap((g) => g.projetos).map((slug) =>
      `<li><a href="projeto.html?p=${slug}">${PROJETOS[slug].cliente}<small>${PROJETOS[slug].titulo}</small></a></li>`).join('') + '</ol>';
  });

  // fileira de vídeos verticais
  // cada vídeo vertical (redes) vira uma "tela de celular" com o vídeo passando sem som
  const reels = Object.entries(PROJETOS)
    .filter(([, p]) => !p.semPrevia)
    .flatMap(([slug, p]) => [...(p.sociais || []), ...(p.personagens || []).flatMap((g) => g.cortes || [])]
      .filter((l) => l && (/vimeo|^\d+$/.test(l) || isFile(l))).map((link) => ({ slug, p, link }))) // só Vimeo: o YouTube mostra botões por cima
    .slice(0, 16);
  const ic = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.5 1.1 5.2 3 1.7-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.4 1.2 4.6 3.1 6.1L4.5 21l4-2c1.1.3 2.3.5 3.5.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 2.5h12a1 1 0 0 1 1 1v18l-7-4.5-7 4.5v-18a1 1 0 0 1 1-1z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M14 4l8 7.5-8 7.5v-4.5C8 14.5 4.5 16.5 2 20c.8-5.5 4-10.5 12-11.5V4z"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M9 18.5a3 3 0 1 1-2-2.8V4l12-2v13.5a3 3 0 1 1-2-2.8V6.3l-8 1.4v10.8z"/></svg>',
  };
  const num = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + ' mil' : String(n));
  document.getElementById('reelsTrack').innerHTML = reels.map(({ slug, p, link }, k) => {
    const seed = (k * 7919 + 13) % 97;
    return `<a class="reel phone" href="projeto.html?p=${slug}" data-bg="${bgSrc(link)}"${isFile(link) ? ` data-file="${link}"` : ''} aria-label="${p.cliente} — ${p.titulo}">
      <div class="phone__video"></div>
      <div class="phone__ui" aria-hidden="true">
        <div class="phone__top"><span>Seguindo</span><b>Para você</b></div>
        <div class="phone__side">
          <i class="phone__avatar">FC</i>
          <i>${ic.heart}<em>${num(1200 + seed * 431)}</em></i>
          <i>${ic.chat}<em>${num(40 + seed * 9)}</em></i>
          <i>${ic.save}<em>${num(90 + seed * 23)}</em></i>
          <i>${ic.share}<em>${num(30 + seed * 7)}</em></i>
          <i class="phone__disc"></i>
        </div>
        <div class="phone__cap"><strong>@fernandocosta</strong><p>${p.cliente} · ${p.titulo}</p><small>${ic.note}som original</small></div>
      </div>
    </a>`;
  }).join('');

  // só carrega o vídeo de fundo quando a "tela" aparece; tira quando sai (fica leve)
  const io = new IntersectionObserver((ents) => ents.forEach((e) => {
    const v = e.target.querySelector('.phone__video');
    if (e.isIntersecting && !v.firstChild && (e.target.dataset.bg || e.target.dataset.file)) {
      v.innerHTML = e.target.dataset.file
        ? `<video src="${e.target.dataset.file}" muted autoplay loop playsinline preload="auto"></video>`
        : `<iframe src="${e.target.dataset.bg}" allow="autoplay; fullscreen" tabindex="-1" title=""></iframe>`;
    } else if (!e.isIntersecting && v.firstChild) {
      v.innerHTML = '';
    }
  }), { rootMargin: '0px 300px' });
  document.querySelectorAll('.phone').forEach((el) => io.observe(el));
})();

// ---------- 4. FILEIRA ANDA PARA O LADO COM O SCROLL ----------
(function reelsScroll() {
  if (reduce) return;
  const sec = document.getElementById('reels');
  const track = document.getElementById('reelsTrack');
  function update() {
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (sec.offsetHeight - innerHeight));
    const max = track.scrollWidth - innerWidth;
    track.style.transform = `translateX(${-p * Math.max(0, max)}px)`;
  }
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  update();
})();

// ---------- 4b. Anéis de luz inclinam conforme passam pela tela ----------
(function orbs() {
  const list = [...document.querySelectorAll('.orb')];
  if (!list.length || reduce) return;
  function update() {
    list.forEach((o) => {
      const r = o.parentElement.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height)); // 0 entrando, 1 saindo
      o.style.setProperty('--tilt', `${(p - 0.5) * 70}deg`);
    });
  }
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
})();

// ---------- 5. Nome da seção atual na tarja ----------
(function now() {
  const label = document.getElementById('now');
  const map = [['inicio', 'Início'], ['words', 'O que eu faço'], ['video', 'Vídeo'], ['foto', 'Foto'], ['sobre', 'Sobre'], ['reels', 'Para as redes']];
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) label.textContent = e.target.dataset.label; }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach(([id, txt]) => { const el = document.getElementById(id); el.dataset.label = txt; io.observe(el); });
})();

// ---------- 6. Vídeo de compilação atrás do nome (link em SHOWREEL, no dados.js) ----------
(function showreel() {
  if (typeof SHOWREEL === 'undefined' || !SHOWREEL) return;
  const reel = document.querySelector('.dust__reel');
  // arquivo MP4 direto no site: roda em loop, sem som, cobrindo a tela
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(SHOWREEL.trim())) {
    reel.innerHTML = `<video class="dust__file" src="${SHOWREEL.trim()}" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>`;
    return;
  }
  let m, src = '';
  if ((m = SHOWREEL.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([\w-]{11})/))) {
    src = `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&controls=0&rel=0&playsinline=1&modestbranding=1`;
  } else if ((m = SHOWREEL.match(/(\d{6,})(?:\/([\da-f]+))?/))) {
    src = `https://player.vimeo.com/video/${m[1]}?${m[2] ? `h=${m[2]}&` : ''}background=1&autoplay=1&loop=1&muted=1`;
  }
  if (!src) return;
  reel.innerHTML = `<iframe class="dust__frame" src="${src}" allow="autoplay; fullscreen; picture-in-picture" title="Compilação de vídeos" tabindex="-1"></iframe>`;
})();

// ---------- 7. CAPA DE VÍDEO: SHOWREEL AO VIVO (cortes rápidos em loop) ----------
// Toca trechos dos vídeos do Vimeo (lista MONTAGEM_VIDEO no dados.js), sem som e sem
// controles, trocando a cada corte. Usa 3 "telas" em rodízio: enquanto uma aparece,
// as próximas já estão carregando o corte seguinte, para a troca ser instantânea.
(function montagem() {
  if (typeof MONTAGEM_VIDEO === 'undefined' || !MONTAGEM_VIDEO.length || reduce) return;
  // a mesma montagem roda na capa de Vídeo e (teste) atrás do nome, na abertura
  run(document.querySelector('#video .cover'));
  if (typeof SHOWREEL === 'undefined' || !SHOWREEL) run(document.querySelector('#inicio .dust__reel'));

  function run(cover) {
  if (!cover) return;
  const box = document.createElement('div');
  box.className = 'cover__montage'; box.setAttribute('aria-hidden', 'true');
  const SLOTS = 3, LEAD = 2.5; // LEAD: o vídeo começa a tocar ~2,5 s antes de aparecer
  const frames = Array.from({ length: SLOTS }, () => {
    const f = document.createElement('iframe');
    f.setAttribute('allow', 'autoplay; fullscreen'); f.setAttribute('tabindex', '-1'); f.title = '';
    box.appendChild(f); return f;
  });
  // cortes que são arquivos do próprio site (ex.: GIF em .mp4): um <video> para cada, já carregado
  const ehArquivo = (l) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(l || ''));
  const vids = {};
  MONTAGEM_VIDEO.forEach((c) => {
    if (!ehArquivo(c.link) || vids[c.link]) return;
    const v = document.createElement('video');
    v.src = c.link; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('muted', ''); v.className = 'mtg-file';
    box.appendChild(v); vids[c.link] = v;
  });
  cover.prepend(box);
  const idOf = (l) => (String(l).match(/(\d{6,})/) || [])[1];
  const url = (c, lead) => `https://player.vimeo.com/video/${idOf(c.link)}?background=1&autoplay=1&muted=1&loop=1&dnt=1#t=${Math.max(0, c.inicio - lead).toFixed(1)}s`;
  const clip = (n) => MONTAGEM_VIDEO[((n % MONTAGEM_VIDEO.length) + MONTAGEM_VIDEO.length) % MONTAGEM_VIDEO.length];
  let i = 0, timer = null, running = false;

  function load(slot, n, lead) {
    const c = clip(n), f = frames[slot];
    if (ehArquivo(c.link)) return; // arquivo do site: já está carregado no seu próprio <video>
    // verticais preenchem a tela horizontal; "foco" (0 topo · 100 base) centraliza o rosto/produto
    f.classList.toggle('is-vertical', !!c.vertical);
    f.style.setProperty('--foco', c.foco ?? 35);
    // zoom (só horizontais): aproxima para tirar legenda/logo da borda · zx/zy = ponto que fica fixo (0–100)
    f.style.setProperty('--zoom', c.zoom || 1);
    f.style.setProperty('--zx', (c.zx ?? 50) + '%');
    f.style.setProperty('--zy', (c.zy ?? 50) + '%');
    // quando terminar de carregar, o take fica PARADO no ponto exato, esperando a vez dele
    // (assim ele entra liso, sem aquele "pulo" de frame no momento do corte)
    f.onload = () => setTimeout(() => {
      if (f.classList.contains('is-on')) return;
      post(f, 'pause'); post(f, 'setCurrentTime', c.inicio);
    }, 600);
    f.src = url(c, lead);
  }
  function post(f, method, value) {
    try { f.contentWindow.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), 'https://player.vimeo.com'); } catch (e) { /* carregando */ }
  }
  // manda o player do Vimeo pular para o segundo exato (API de mensagens do Vimeo)
  function seek(f, t) {
    try {
      f.contentWindow.postMessage(JSON.stringify({ method: 'setCurrentTime', value: t }), 'https://player.vimeo.com');
      f.contentWindow.postMessage(JSON.stringify({ method: 'play' }), 'https://player.vimeo.com');
    } catch (e) { /* ainda carregando: segue do ponto do link */ }
  }
  function step() {
    const cur = i % SLOTS;
    const c = clip(i);
    if (ehArquivo(c.link)) {
      const v = vids[c.link];
      v.style.objectPosition = `50% ${c.foco ?? 40}%`; // vídeos verticais: altura do enquadramento
      try { if (Math.abs(v.currentTime - (c.inicio || 0)) > 0.3) v.currentTime = c.inicio || 0; v.play().catch(() => {}); } catch (e) { /* carregando */ }
      frames.forEach((f) => f.classList.remove('is-on'));
      Object.values(vids).forEach((x) => x.classList.toggle('is-on', x === v));
    } else {
      seek(frames[cur], c.inicio); // o corte começa exatamente no "inicio" da lista
      frames.forEach((f, k) => f.classList.toggle('is-on', k === cur));
      Object.values(vids).forEach((x) => { x.classList.remove('is-on'); x.pause(); });
    }
    // o próximo corte que for arquivo do site já fica parado no ponto certo (entra sem "pulo")
    const nx = clip(i + 1);
    if (ehArquivo(nx.link) && nx.link !== c.link) { try { const nv = vids[nx.link]; nv.pause(); nv.currentTime = nx.inicio || 0; } catch (e) { /* carregando */ } }
    // a tela que acabou de sair carrega o corte de 2 passos à frente
    const freed = (i + SLOTS - 1) % SLOTS;
    if (i > 0) load(freed, i + SLOTS - 1, 0);
    timer = setTimeout(() => { i++; step(); }, clip(i).dur * 1000);
  }
  function start() {
    if (running) return; running = true;
    for (let k = 0; k < SLOTS; k++) load((i + k) % SLOTS, i + k, 0);
    setTimeout(step, 900); // pequeno respiro para o primeiro corte carregar
  }
  function stop() {
    running = false; clearTimeout(timer);
    frames.forEach((f) => { f.src = 'about:blank'; f.classList.remove('is-on'); });
    Object.values(vids).forEach((x) => { x.pause(); x.classList.remove('is-on'); });
  }
  // só toca quando a capa está na tela (economiza internet)
  new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.15 }).observe(cover);
  }
})();

// ---------- GALERIA ABERTA (seção Foto) ----------
// fotos soltas em mosaico, coladinhas; passar o mouse destaca uma; clique abre em tela cheia
(function galeriaAberta() {
  const box = document.getElementById('openGal');
  if (!box || typeof GALERIA_ABERTA === 'undefined' || !GALERIA_ABERTA.length) return;
  box.innerHTML = GALERIA_ABERTA.map((src, k) =>
    `<button class="og__item gitem" data-i="${k}" aria-label="Ver foto ${k + 1} em tela cheia"><img src="${src}" alt="Fotografia de Fernando Costa ${k + 1}" decoding="async"></button>`).join('');
  // cada foto aparece suavemente quando entra na tela
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  box.querySelectorAll('.og__item').forEach((el, k) => { el.style.transitionDelay = `${(k % 4) * 70}ms`; io.observe(el); });
  if (typeof setupLightbox === 'function') setupLightbox(GALERIA_ABERTA, 'Galeria');
})();

// galeria aberta em fileiras alinhadas: cada foto ocupa a largura proporcional ao seu formato
(function galeriaFileiras() {
  const box = document.getElementById('openGal');
  if (!box) return;
  box.classList.add('is-rows');
  box.querySelectorAll('.og__item img').forEach((img) => {
    const fit = () => {
      const r = img.naturalWidth / img.naturalHeight || 0.8;
      const el = img.parentElement;
      el.style.flex = `${r} 1 ${Math.round(r * 300)}px`;
      el.style.aspectRatio = r;
    };
    img.complete ? fit() : img.addEventListener('load', fit, { once: true });
  });
})();
