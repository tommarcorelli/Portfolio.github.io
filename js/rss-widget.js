/* ================================================================
   WIDGET RSS — Flux en direct via rss2json
   ================================================================ */
(function () {

  const RSS_SOURCES = [
    // Hacking & Vulnérabilités
    { name: 'Exploit-DB',        cat: 'hacking', url: 'https://www.exploit-db.com/rss.xml' },
    { name: 'Krebs on Security', cat: 'hacking', url: 'https://krebsonsecurity.com/feed/' },
    { name: 'The Hacker News',   cat: 'hacking', url: 'https://feeds.feedburner.com/TheHackersNews' },
    // Systèmes & Cloud
    { name: 'LinuxFr',           cat: 'systemes', url: 'https://linuxfr.org/news.atom' },
    { name: 'Developpez.com',    cat: 'systemes', url: 'https://www.developpez.com/index/rss' },
    { name: 'Journal du Hacker', cat: 'systemes', url: 'https://www.journalduhacker.net/rss' },
    // Actualité Tech
    { name: 'Next',              cat: 'actu', url: 'https://next.ink/feed/' },
    { name: 'Numerama',          cat: 'actu', url: 'https://www.numerama.com/feed/' },
    { name: 'Le Crabe Info',     cat: 'actu', url: 'https://www.lecrabeinfo.net/feed' },
    // Cybersécurité
    { name: 'CERT-FR',           cat: 'cyber', url: 'https://www.cert.ssi.gouv.fr/feed/' },
    { name: 'Hacker News',       cat: 'cyber', url: 'https://hnrss.org/frontpage' },
    // Réseau & Infrastructure
    { name: 'LeMagIT',           cat: 'reseau', url: 'https://www.lemagit.fr/rss/CreativeCloud.rss' },
    { name: 'Cisco Blog',        cat: 'reseau', url: 'https://feeds.feedburner.com/CiscoSecurityAdvisory' },
    { name: 'IT-Connect',        cat: 'reseau', url: 'https://www.it-connect.fr/feed/' },
  ];

  const CAT_LABELS = {
    hacking:  'Hacking & Vulnérabilités',
    systemes: 'Systèmes & Cloud',
    actu:     'Actualité Tech',
    cyber:    'Cybersécurité',
    reseau:   'Réseau & Infrastructure',
  };

  const API = 'https://api.rss2json.com/v1/api.json?api_key=pf25n3eyxaap3utfr9kuoipgngfnrztazpchlce9&rss_url=';
  const ITEMS_PER_FEED = 2;

  let allArticles = [];
  let currentFilter = 'all';

  const grid    = document.getElementById('rss-grid');
  const status  = document.getElementById('rss-status');
  const tabs    = document.querySelectorAll('.rss-tab:not(.rss-tab--refresh)');
  const refresh = document.getElementById('rss-refresh');

  if (!grid) return;

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function renderArticles() {
    const filtered = currentFilter === 'all'
      ? allArticles
      : allArticles.filter(a => a.cat === currentFilter);

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="rss-empty">Aucun article pour cette catégorie.</p>';
      return;
    }

    // Grouper par catégorie
    const cats = currentFilter === 'all'
      ? Object.keys(CAT_LABELS)
      : [currentFilter];

    grid.innerHTML = cats.map(cat => {
      const articles = filtered.filter(a => a.cat === cat);
      if (articles.length === 0) return '';
      return `
        <div class="rss-section">
          <h4 class="rss-section__title">
            <span class="rss-section__icon" aria-hidden="true">◈</span>
            ${CAT_LABELS[cat]}
            <span class="rss-section__count">${articles.length} articles</span>
          </h4>
          <div class="rss-section__grid">
            ${articles.map(a => `
              <article class="rss-card">
                <div class="rss-card__meta">
                  <span class="rss-card__source">${a.source}</span>
                  <span class="rss-card__date">${formatDate(a.date)}</span>
                </div>
                <div class="rss-card__title">
                  <a href="${a.link}" target="_blank" rel="noopener noreferrer">${a.title}</a>
                </div>
                <a href="${a.link}" target="_blank" rel="noopener noreferrer" class="rss-card__read">
                  Lire l'article ↗
                </a>
              </article>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  async function fetchFeed(source) {
    try {
      const res  = await fetch(`${API}${encodeURIComponent(source.url)}&count=${ITEMS_PER_FEED}`);
      const data = await res.json();
      if (data.status !== 'ok' || !data.items) return [];
      return data.items.map(item => ({
        title:  item.title,
        link:   item.link,
        date:   item.pubDate,
        source: source.name,
        cat:    source.cat,
      }));
    } catch { return []; }
  }

  async function loadAllFeeds() {
    if (!grid) return;
    status.textContent = 'Chargement des flux...';
    status.style.display = 'block';
    grid.innerHTML = '';
    allArticles = [];

    const results = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));
    results.forEach(r => { if (r.status === 'fulfilled') allArticles.push(...r.value); });

    // Trier par date décroissante
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    status.style.display = 'none';
    if (allArticles.length === 0) {
      status.textContent = 'Impossible de charger les flux. Vérifiez votre connexion.';
      status.style.display = 'block';
      return;
    }
    renderArticles();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('rss-tab--active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('rss-tab--active');
      tab.setAttribute('aria-selected', 'true');
      currentFilter = tab.dataset.filter;
      renderArticles();
    });
  });

  refresh.addEventListener('click', loadAllFeeds);

  // Charger au chargement de la page
  loadAllFeeds();

})();


