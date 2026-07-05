/* ================================================================
   17. INITIALISATION
   ================================================================ */
// Appliquer le mode jour IMMÉDIATEMENT (avant le préloader) pour éviter le flash bleu
if (localStorage.getItem('dayMode') === 'true') {
  document.documentElement.classList.add('mode-jour');
}

// Lancer le préloader immédiatement — pas besoin d'attendre DOMContentLoaded
// car le canvas #pl-canvas est déjà dans le DOM (placé avant ce script)
initPreloader();

document.addEventListener('DOMContentLoaded', () => {
  initDayMode();
  initNavigation();
  initScrollReveal();
  initTimelineReveal();
  initReadingProgress();
  initSkillsFilter();
  initCounters();
  initTerminalTypewriter();
  initProjectTilt();
  initContactForm();
  initKonamiCode();
  initScrollToTop();
  updateFooterYear();
  initMangaCursor();
  initCursorRipple();

  // Lightbox tableau E5
  function ouvrirTableau() {
    document.getElementById('tableau-lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  function fermerTableau() {
    document.getElementById('tableau-lightbox').classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  document.querySelectorAll('.exam-synthesis-btn--zoom, .exam-synthesis-img').forEach(el => {
    el.addEventListener('click', ouvrirTableau);
  });
  const lightbox = document.getElementById('tableau-lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) fermerTableau(); });
    lightbox.querySelector('.tableau-lightbox__close')?.addEventListener('click', fermerTableau);
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermerTableau(); });

  console.log(
    '%c[TM] _ Portfolio chargé ✓\n%cBTS SIO SISR — Nexa Digital School, Paris\n%cTips: clique sur le toggle ☀️ pour le mode Jour',
    'color:#00f5ff;font-family:monospace;font-size:16px;font-weight:bold;',
    'color:#7a9bc4;font-family:monospace;font-size:11px;',
    'color:#dc1414;font-family:monospace;font-size:11px;'
  );
});



/* ================================================================
   PROJETS & E5 — Accordéons
   ================================================================ */
(function () {
  document.querySelectorAll('.projets-accord__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const body    = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen  = trigger.getAttribute('aria-expanded') === 'true';
      const chevron = trigger.querySelector('.projets-accord__chevron');

      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      trigger.classList.toggle('projets-accord__trigger--open', !isOpen);
      body.classList.toggle('projets-accord__body--hidden', isOpen);
      if (chevron) chevron.textContent = isOpen ? '▼' : '▲';
    });
  });
})();

