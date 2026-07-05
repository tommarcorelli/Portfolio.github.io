/**
 * ================================================================
 * script.js — Portfolio Tom Marcorelli
 * BTS SIO SISR — Thème Manga Japonais
 *
 *  1.  Utilitaires
 *  2.  Préloader animé
 *  3.  Navigation
 *  5.  Scroll reveal
 *  6.  Barre de progression de lecture
 *  7.  Filtres tableau de compétences
 *  8.  Compteurs animés
 *  9.  Particules canvas hero
 *  10. Terminal typewriter
 *  11. Tilt 3D cartes projets
 *  12. Formulaire de contact
 *  13. Bouton retour en haut
 *  14. Easter egg Konami
 *  15. Mode Jour (toggle clair/sombre)
 *  16. Scroll reveal timeline & certifications
 *  17. Curseur manga (mode jour)
 *  18. Initialisation
 * ================================================================
 */

'use strict';

/* ================================================================
   1. UTILITAIRES
   ================================================================ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

function isDayMode() {
  return document.documentElement.classList.contains('mode-jour');
}

function updateFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
