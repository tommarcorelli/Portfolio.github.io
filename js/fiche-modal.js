/* ================================================================
   MODALE FICHE — ouverture/fermeture de l'iframe plein écran
   (fonctions globales : appelées via onclick dans le HTML et via
   postMessage depuis les fiches projet)
   ================================================================ */
'use strict';

function openFicheModal(url) {
  const modal = document.getElementById('fiche-modal');
  document.getElementById('fiche-modal-frame').src = url;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeFicheModal() {
  document.getElementById('fiche-modal').classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('fiche-modal-frame').src = ''; }, 200);
}

// Le bouton « ← Portfolio » dans la fiche envoie ce message
window.addEventListener('message', function (e) {
  if (e.data === 'close-fiche-modal') closeFicheModal();
});

// Fermer avec Échap
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && document.getElementById('fiche-modal').classList.contains('is-open'))
    closeFicheModal();
});
