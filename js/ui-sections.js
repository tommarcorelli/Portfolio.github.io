/* ================================================================
   7. FILTRES COMPÉTENCES
   Filtre les skill-cards par domaine (Linux, Windows, Sécurité, DevOps)
   ================================================================ */
function initSkillsFilter() {
  const grid = $('.skills-cards-grid');
  if (!grid) return;

  const domainMap = {
    'Linux':    'skill-card--system',
    'Windows':  'skill-card--network',
    'Sécurité': 'skill-card--security',
    'DevOps':   'skill-card--dev',
  };

  const filterBar = document.createElement('div');
  filterBar.classList.add('skills-filter-bar');
  filterBar.setAttribute('role', 'group');
  filterBar.setAttribute('aria-label', 'Filtrer par domaine');

  filterBar.appendChild(createFilterButton('Tout', true));
  Object.keys(domainMap).forEach(label => filterBar.appendChild(createFilterButton(label, false)));

  grid.parentNode.insertBefore(filterBar, grid);

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    $$('.filter-btn', filterBar).forEach(b => {
      b.classList.toggle('filter-btn--active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    const filter = btn.dataset.filter;
    $$('.skill-card', grid).forEach(card => {
      const visible = filter === 'Tout' || card.classList.contains(domainMap[filter]);
      card.style.display = visible ? '' : 'none';
    });
  });
}

function createFilterButton(label, isActive) {
  const btn = document.createElement('button');
  btn.classList.add('filter-btn');
  if (isActive) btn.classList.add('filter-btn--active');
  btn.dataset.filter = label;
  btn.textContent    = label;
  btn.type           = 'button';
  btn.setAttribute('aria-pressed', String(isActive));
  return btn;
}

/* ================================================================
   8. COMPTEURS ANIMÉS
   ================================================================ */
function initCounters() {
  const vals = $$('.stat-item__value');
  if (!vals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      // Extrait le nombre en début de chaîne (gère "10+", "95%", "28", etc.)
      const match = el.textContent.trim().match(/^(\d+)/);
      const num   = match ? parseInt(match[1], 10) : NaN;
      if (!isNaN(num)) animateCount(el, num);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  vals.forEach(el => observer.observe(el));

  function animateCount(el, target, duration = 1200) {
    const start = performance.now();
    (function step(now) {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
}



/* ================================================================
   10. TERMINAL TYPEWRITER — LETTRE PAR LETTRE
   ================================================================ */
function initTerminalTypewriter() {
  const body = $('#terminal-body');
  if (!body) return;

  const script = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'output', text: 'tom_marcorelli',                       delay: 200 },
    { type: 'blank' },
    { type: 'cmd',    text: 'cat profil.txt' },
    { type: 'output', text: 'BTS SIO SISR — Réseaux & Sécurité',   delay: 200 },
    { type: 'output', text: 'Age: 28 ans | Argenteuil, France',     delay: 80  },
    { type: 'blank' },
    { type: 'cmd',    text: 'ping cybersécurité.fr' },
    { type: 'output', text: '64 bytes: icmp_seq=1 ttl=64 time=0.42ms', delay: 300, success: true },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentEl = null;

  const cursorEl = document.createElement('p');
  cursorEl.classList.add('terminal-line');
  cursorEl.innerHTML = '<span class="terminal-prompt">$</span> <span class="terminal-cursor">▌</span>';

  function typeChar() {
    if (lineIndex >= script.length) {
      body.appendChild(cursorEl);
      return;
    }

    const line = script[lineIndex];

    if (line.type === 'blank') {
      body.appendChild(document.createElement('br'));
      lineIndex++;
      setTimeout(typeChar, 200);
      return;
    }

    if (charIndex === 0) {
      currentEl = document.createElement('p');

      if (line.type === 'cmd') {
        currentEl.classList.add('terminal-line');
        currentEl.innerHTML = '<span class="terminal-prompt">$</span> <span class="terminal-cmd-text"></span>';
        body.appendChild(currentEl);

      } else if (line.type === 'output') {
        currentEl.classList.add('terminal-output');
        if (line.success) currentEl.classList.add('terminal-output--success');
        body.appendChild(currentEl);

        setTimeout(() => {
          currentEl.textContent = line.text;
          body.scrollTop = body.scrollHeight; // scroll après ajout du texte
          lineIndex++;
          charIndex = 0;
          setTimeout(typeChar, 120);
        }, line.delay || 100);
        return;
      }
    }

    if (line.type === 'cmd') {
      const textSpan = currentEl.querySelector('.terminal-cmd-text');
      if (textSpan && charIndex < line.text.length) {
        textSpan.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeChar, Math.random() * 60 + 60);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeChar, 300);
      }
    }

    body.scrollTop = body.scrollHeight;
  }

  setTimeout(typeChar, 800);
}

/* ================================================================
   11. TILT 3D CARTES PROJETS
   Rotation selon position souris, désactivé sur tactile
   ================================================================ */
function initProjectTilt() {
  const cards = $$('.project-card');
  if (!cards.length || window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    // Évite le doublon si le HTML contient déjà un .project-card__shine statique
    if (!card.querySelector('.project-card__shine')) {
      const shine = document.createElement('div');
      shine.classList.add('project-card__shine');
      card.appendChild(shine);
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top)  / rect.height;
      const tiltX = (relY - 0.5) * -8;
      const tiltY = (relX - 0.5) *  8;

      card.style.setProperty('--tilt-x', `${tiltX}deg`);
      card.style.setProperty('--tilt-y', `${tiltY}deg`);
      card.style.setProperty('--tilt-z', '8px');
      card.style.setProperty('--shine-x', `${relX * 100}%`);
      card.style.setProperty('--shine-y', `${relY * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--tilt-z', '0px');
    });
  });
}

