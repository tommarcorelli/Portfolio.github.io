/* ================================================================
   13. BOUTON RETOUR EN HAUT
   Apparaît après 300px de scroll, style Manga [↑]
   ================================================================ */
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Retour en haut');
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position: fixed;
    bottom: 22px;
    right: 22px;
    z-index: 900;
    width: 42px;
    height: 42px;
    background: transparent;
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s, background 0.2s, color 0.2s, box-shadow 0.2s, border-color 0.2s;
    box-shadow: none;
  `;

  function applyIdleStyle() {
    if (isDayMode()) {
      btn.style.border      = '1.5px solid #111';
      btn.style.color       = '#111';
      btn.style.background  = 'transparent';
      btn.style.boxShadow   = '4px 4px 0px #111';
    } else {
      btn.style.border      = '1.5px solid #eab308';
      btn.style.color       = '#eab308';
      btn.style.background  = 'transparent';
      btn.style.boxShadow   = 'none';
    }
  }

  applyIdleStyle();

  btn.addEventListener('mouseenter', () => {
    if (isDayMode()) {
      btn.style.background = '#111';
      btn.style.color      = '#fff';
      btn.style.border     = '1.5px solid #111';
      btn.style.boxShadow  = '4px 4px 0px #111';
    } else {
      btn.style.background = '#eab308';
      btn.style.color      = '#06080a';
      btn.style.boxShadow  = '0 0 14px #eab308';
      btn.style.border     = '1.5px solid #eab308';
    }
  });

  btn.addEventListener('mouseleave', () => {
    applyIdleStyle();
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(btn);

  // Mise à jour des couleurs quand le mode change
  const modeToggle = document.getElementById('matrix-toggle');
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      setTimeout(applyIdleStyle, 0);
    });
  }

  window.addEventListener('scroll', () => {
    const visible = window.scrollY > 300;
    btn.style.opacity       = visible ? '1'    : '0';
    btn.style.pointerEvents = visible ? 'auto' : 'none';
  }, { passive: true });
}

/* ================================================================
   14. EASTER EGG KONAMI  ↑↑↓↓←→←→BA
   Pluie de kanjis plein écran via canvas
   ================================================================ */
function initKonamiCode() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let typed = [];

  document.addEventListener('keydown', e => {
    typed.push(e.key);
    typed = typed.slice(-seq.length);
    if (typed.join() !== seq.join()) return;
    typed = [];
    triggerKonamiRain();
  });
}

function triggerKonamiRain() {
  if (document.getElementById('konami-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'konami-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99990;
    pointer-events: none;
  `;
  document.body.appendChild(canvas);

  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99995;
    font-family: 'Orbitron', monospace;
    font-size: clamp(18px, 4vw, 36px);
    font-weight: 900;
    color: #eab308;
    text-shadow: 0 0 30px #eab308, 0 0 60px #eab308;
    letter-spacing: 4px;
    text-align: center;
    pointer-events: none;
    animation: konamiPulse 0.5s ease-in-out infinite alternate;
  `;
  toast.innerHTML = '🎮 CODE KONAMI<br><span style="font-size:0.55em;color:#00f5ff;letter-spacing:6px;">神&nbsp;&nbsp;秘&nbsp;&nbsp;の&nbsp;&nbsp;力</span>';
  document.body.appendChild(toast);

  if (!document.getElementById('konami-styles')) {
    const style = document.createElement('style');
    style.id = 'konami-styles';
    style.textContent = `
      @keyframes konamiPulse {
        from { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
        to   { opacity: 1;   transform: translate(-50%, -50%) scale(1.06); }
      }
    `;
    document.head.appendChild(style);
  }

  const ctx   = canvas.getContext('2d');
  const W     = canvas.width;
  const H     = canvas.height;
  const cols  = Math.floor(W / 22);
  const CHARS = '電脳網絡神秘力夢幻影光速星宇宙時間存在未来過去現在ネットワーク';
  const drops = Array.from({ length: cols }, () => Math.random() * -H);

  const start    = performance.now();
  const DURATION = 4000;

  function rain(now) {
    const elapsed = now - start;
    if (elapsed > DURATION) {
      canvas.style.transition = 'opacity 0.6s';
      canvas.style.opacity    = '0';
      toast.style.transition  = 'opacity 0.6s';
      toast.style.opacity     = '0';
      setTimeout(() => { canvas.remove(); toast.remove(); }, 700);
      return;
    }

    const fadeIn  = Math.min(elapsed / 300, 1);
    const fadeOut = elapsed > 3500 ? 1 - (elapsed - 3500) / 500 : 1;
    const alpha   = fadeIn * fadeOut;

    ctx.fillStyle = `rgba(6,8,10,${0.18 * alpha})`;
    ctx.fillRect(0, 0, W, H);
    ctx.font = '16px "Share Tech Mono", monospace';

    drops.forEach((y, i) => {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x    = i * 22;
      ctx.fillStyle = Math.random() < 0.18
        ? `rgba(234,179,8,${alpha})`
        : `rgba(0,245,255,${alpha * 0.85})`;
      ctx.fillText(char, x, y);
      drops[i] += 18 + Math.random() * 8;
      if (drops[i] > H) drops[i] = -20 - Math.random() * 60;
    });

    requestAnimationFrame(rain);
  }

  requestAnimationFrame(rain);
}

/* ================================================================
   14. MODE JOUR — Toggle clair/sombre
   La préférence est persistée dans localStorage pour survivre aux rechargements.
   ================================================================ */
function initDayMode() {
  const btn = $('#matrix-toggle');
  if (!btn) return;

  // Restaurer l'état sauvegardé
  let isActive = localStorage.getItem('dayMode') === 'true';
  document.documentElement.classList.toggle('mode-jour', isActive);
  btn.setAttribute('aria-label', isActive ? 'Désactiver le mode Jour' : 'Activer le mode Jour');
  btn.querySelector('.matrix-toggle__icon').textContent = isActive ? '☽' : '☀';

  btn.addEventListener('click', () => {
    isActive = !isActive;
    localStorage.setItem('dayMode', String(isActive));
    document.documentElement.classList.toggle('mode-jour', isActive);
    btn.setAttribute('aria-label', isActive ? 'Désactiver le mode Jour' : 'Activer le mode Jour');
    btn.querySelector('.matrix-toggle__icon').textContent = isActive ? '☽' : '☀';
  });
}


/* ================================================================
   16. SCROLL REVEAL — TIMELINE & CERTIFICATIONS
   ================================================================ */
function initTimelineReveal() {
  const items = $$('.timeline-item, .cert-card');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-revealed'), i * 100);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => obs.observe(el));
}

/* ================================================================
   18. CURSEUR PLUME — Mode jour ET mode nuit
   Plume ✒️ + traces + splash au clic
   Mode jour  : traces #111 (encre noire),  splash #111
   Mode nuit  : traces #ddeef8 (blanc-bleu), splash #eab308 (or)
   ================================================================ */
function initMangaCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  // Plume
  const pen = document.createElement('div');
  pen.id = 'manga-pen';
  pen.setAttribute('aria-hidden', 'true');
  pen.textContent = '✒️';
  pen.style.cssText = `
    position: fixed;
    pointer-events: none;
    font-size: 20px;
    transform: rotate(-30deg);
    z-index: 99999;
    display: none;
    line-height: 1;
    transition: none;
  `;
  document.body.appendChild(pen);

  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    pen.style.display = 'block';
    pen.style.left = (mx + 5) + 'px';
    pen.style.top  = (my - 20) + 'px';

    // Couleur de trace selon le mode
    const trailColor = isDayMode() ? '#111' : 'rgba(221, 238, 248, 0.7)';

    // Bout de la plume : la plume est à (mx+5, my-20), rotation -30deg, taille 20px
    // Le bout pointe en bas à gauche => on recentre sur le vrai tip
    const tipX = mx + 14;
    const tipY = my + 2;

    // Trace
    if (Math.random() > 0.45) {
      const dot = document.createElement('div');
      dot.setAttribute('aria-hidden', 'true');
      const size = 2 + Math.random() * 5;
      dot.style.cssText = `
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        z-index: 99998;
        width: ${size}px;
        height: ${size}px;
        background: ${trailColor};
        left: ${tipX}px;
        top: ${tipY}px;
        transform: translate(-50%, -50%);
        animation: mangaInkFade 0.7s ease-out forwards;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 700);
    }
  });

  document.addEventListener('mouseleave', () => { pen.style.display = 'none'; });

  // Splash au clic
  document.addEventListener('click', e => {
    // Couleur du splash selon le mode
    const splashColor = isDayMode() ? '#111' : '#eab308';

    for (let i = 0; i < 10; i++) {
      const drop = document.createElement('div');
      drop.setAttribute('aria-hidden', 'true');
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const dist  = 8 + Math.random() * 22;
      const size  = 3 + Math.random() * 8;
      drop.style.cssText = `
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        z-index: 99997;
        width: ${size}px;
        height: ${size}px;
        background: ${splashColor};
        left: ${e.clientX + Math.cos(angle) * dist}px;
        top:  ${e.clientY + Math.sin(angle) * dist}px;
        transform: translate(-50%, -50%);
        animation: mangaSplash 0.55s ease-out forwards;
      `;
      document.body.appendChild(drop);
      setTimeout(() => drop.remove(), 600);
    }
  });
}



/* ================================================================
   20. RIPPLE NÉON AU CLIC DU CURSEUR — Mode nuit uniquement
   3 cercles concentriques qui irradient à chaque clic
   ================================================================ */
function initCursorRipple() {
  // Désactivé : la plume manga gère les effets au clic en mode nuit et jour.
  // Conservé pour référence future si le ripple néon est réactivé.
}

