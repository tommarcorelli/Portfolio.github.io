/* ================================================================
   REACT DEMOS — openReactDemo / closeReactDemo
   ================================================================ */

function closeReactDemo() {
  const modal = document.getElementById('react-demo-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
  if (window._reactDemoRoot) { window._reactDemoRoot.unmount(); window._reactDemoRoot = null; }
  const root = document.getElementById('react-demo-root');
  if (root) root.innerHTML = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeReactDemo();
});

function openReactDemo(project) {
  const modal   = document.getElementById('react-demo-modal');
  const titleEl = document.getElementById('react-demo-title');
  const root    = document.getElementById('react-demo-root');
  if (!modal || !root) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const titles = { lamp: 'LAMP + pfSense', ad: 'Active Directory & GPO', k3s: 'Lab Kubernetes K3s' };
  titleEl.textContent = titles[project] || project;

  if (window._reactDemoRoot) { window._reactDemoRoot.unmount(); window._reactDemoRoot = null; }
  root.innerHTML = '';

  const { createElement: h, useState } = React;
  const jour = document.documentElement.classList.contains('mode-jour');

  // Palette — mode nuit / mode jour
  const GOLD  = jour ? '#dc1414' : '#eab308';
  const CYAN  = jour ? '#1e293b' : '#dff0fb';
  const DIM   = jour ? '#94a3b8' : '#5a7a8a';
  const MUTED = jour ? '#555'    : '#a8c4d8';
  const GREEN = jour ? '#16a34a' : '#22c55e';
  const RED   = '#ef4444';
  const BG    = jour ? '#f8fafc' : '#06080a';
  const CARD  = jour ? '#ffffff' : '#0f1a22';

  const BORDER_ACCENT  = jour ? 'rgba(220,20,20,.3)'   : 'rgba(234,179,8,.3)';
  const BORDER_ACCENT2 = jour ? 'rgba(220,20,20,.2)'   : 'rgba(234,179,8,.2)';
  const BORDER_FAINT   = jour ? 'rgba(0,0,0,.08)'      : 'rgba(255,255,255,.08)';
  const BORDER_CARD    = jour ? 'rgba(220,20,20,.25)'  : 'rgba(234,179,8,.3)';
  const BG_ACCENT      = jour ? 'rgba(220,20,20,.07)'  : 'rgba(234,179,8,.1)';
  const BG_ACCENT2     = jour ? 'rgba(220,20,20,.06)'  : 'rgba(234,179,8,.12)';
  const BG_ROW         = jour ? '#f1f5f9'              : '#080f14';

  const tabStyle = (a) => ({
    padding: '.3rem .8rem', border: `1px solid ${a ? GOLD : BORDER_ACCENT}`,
    borderRadius: '4px', fontSize: '.7rem', cursor: 'pointer',
    color: a ? GOLD : MUTED, background: a ? BG_ACCENT : 'none',
    fontFamily: "'Share Tech Mono',monospace", transition: 'all .15s',
  });
  const panelStyle = { background: CARD, border: `2px solid ${BORDER_CARD}`, borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem', boxShadow: jour ? '0 1px 4px rgba(0,0,0,.06)' : 'none' };
  const ptitleStyle = { fontSize: '.65rem', color: GOLD, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem', borderBottom: `1px solid ${BORDER_ACCENT2}`, paddingBottom: '.4rem' };
  const rowStyle = { display: 'flex', justifyContent: 'space-between', padding: '.35rem 0', borderBottom: `1px solid ${BORDER_FAINT}`, fontSize: '.7rem', flexWrap: 'wrap', gap: '.25rem', alignItems: 'center' };
  const btnStyle = { padding: '.35rem .9rem', background: BG_ACCENT2, border: `1px solid ${BORDER_ACCENT}`, color: GOLD, borderRadius: '4px', cursor: 'pointer', fontSize: '.72rem', fontFamily: "'Share Tech Mono',monospace" };
  const appStyle = { fontFamily: "'Share Tech Mono',monospace", background: BG, color: CYAN, minHeight: '100%', padding: '1.5rem', boxSizing: 'border-box' };
  const titleStyle = { fontFamily: "'Orbitron',sans-serif", fontSize: '1rem', color: GOLD, marginBottom: '1.25rem', letterSpacing: '.05em' };

  // ── DEMO LAMP ──────────────────────────────────────────────────
  if (project === 'lamp') {
    const NODES = [
      { id: 'internet', icon: '🌐', name: 'Internet',         ip: 'WAN · 192.168.8.160',                   status: 'fw' },
      { id: 'pfsense',  icon: '🔥', name: 'pfSense CE 2.7',   ip: 'LAN: 192.168.10.2 · DMZ: 192.168.20.2', status: 'fw' },
      { id: 'debian',   icon: '🖥️', name: 'Debian 12 (LAMP)', ip: '192.168.20.10 — DMZ fixe',              status: 'up' },
      { id: 'client',   icon: '💻', name: 'Windows 10',        ip: '192.168.10.100 — DHCP LAN',             status: 'up' },
    ];
    const SERVICES = [
      { name: 'Apache',     ver: '2.4.67',   port: '80/443', detail: 'Virtual Host intranet.local · enabled au boot' },
      { name: 'MariaDB',    ver: '10.11.14', port: '3306',   detail: 'Sauvegarde mysqldump quotidienne via cron'      },
      { name: 'PHP',        ver: '8.2.31',   port: '—',      detail: 'libapache2-mod-php · php-mysql'                 },
      { name: 'phpMyAdmin', ver: '5.2.1',    port: '80/443', detail: 'intranet.local/phpmyadmin'                      },
      { name: 'Cron',       ver: '—',        port: '—',      detail: '0 0 * * * /bin/bash ~/backup_db.sh'             },
    ];
    const RULES = [
      { src: 'LAN', dst: 'DMZ', proto: 'TCP 80/443', action: 'allow', detail: '→ 192.168.20.10 (intranet LAMP)'  },
      { src: 'DMZ', dst: 'WAN', proto: 'IPv4 *',     action: 'allow', detail: 'Mises à jour Debian'               },
      { src: 'DMZ', dst: 'LAN', proto: 'IPv4 *',     action: 'block', detail: 'Isolation critique — prouvée ✔'    },
    ];
    const LOGS = [
      { t: 'cmd',  v: 'tom@lamp:~$ systemctl status apache2 mariadb' },
      { t: 'ok',   v: '● apache2  — active (running), enabled'       },
      { t: 'ok',   v: '● mariadb  — active (running), enabled'       },
      { t: 'cmd',  v: 'tom@lamp:~$ ip a | grep "inet 192"'           },
      { t: 'ok',   v: 'inet 192.168.20.10/24 brd 192.168.20.255 global ens33' },
      { t: 'cmd',  v: 'tom@lamp:~$ crontab -l'                       },
      { t: 'ok',   v: '0 0 * * * /bin/bash ~/backup_db.sh'           },
    ];
    const TESTS = [
      { label: 'Ping gateway pfSense (192.168.20.2)', delay: 900,  result: '4 packets tx, 4 received — 0% loss · gateway OK ✔',           ok: true  },
      { label: 'Isolation DMZ → LAN (192.168.10.100)', delay: 1100, result: '4 packets tx, 0 received — 100% packet loss · DMZ isolée ✔', ok: true  },
      { label: 'Accès intranet.local depuis LAN',       delay: 1300, result: 'HTTP 200 OK · intranet.local → 192.168.20.10 · DNS pfSense ✔', ok: true },
      { label: 'Accès intranet depuis DMZ (rebond)',     delay: 800,  result: 'Connection refused · Règle Block DMZ→LAN active ✔',          ok: true  },
      { label: 'Portail captif — sans auth',             delay: 700,  result: 'Redirect 302 → 192.168.10.2:8002/captive · Bloqué ✔',        ok: true  },
      { label: 'Portail captif — employe1 auth',         delay: 1500, result: 'Auth OK · Accès réseau autorisé par pfSense ✔',              ok: true  },
    ];

    function LampDemo() {
      const [tab, setTab]       = useState('services');
      const [running, setRunning] = useState(null);
      const [results, setResults] = useState({});

      const runTest = (i) => {
        if (running !== null) return;
        setRunning(i);
        setTimeout(() => {
          setResults(r => ({ ...r, [i]: TESTS[i] }));
          setRunning(null);
        }, TESTS[i].delay);
      };

      const runAll = () => {
        if (running !== null) return;
        TESTS.forEach((t, i) => {
          setTimeout(() => {
            setResults(r => ({ ...r, [i]: TESTS[i] }));
          }, t.delay + i * 300);
        });
      };

      return h('div', { style: appStyle },
        h('p', { style: titleStyle }, '⚡ Simulation — Serveur Web LAMP + pfSense CE 2.7'),

        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '.75rem', marginBottom: '1.5rem' } },
          ...NODES.map(n => h('div', { key: n.id, style: { background: CARD, border: `2px solid ${BORDER_ACCENT2}`, borderRadius: '8px', padding: '.75rem', textAlign: 'center' } },
            h('div', { style: { fontSize: '.55rem', display: 'inline-block', marginBottom: '.25rem', padding: '1px 6px', borderRadius: '8px', background: n.status === 'fw' ? BG_ACCENT2 : 'rgba(34,197,94,.15)', color: n.status === 'fw' ? GOLD : GREEN, border: `1px solid ${n.status === 'fw' ? BORDER_ACCENT : 'rgba(34,197,94,.4)'}` } }, n.status === 'fw' ? 'Pare-feu' : 'En ligne'),
            h('div', { style: { fontSize: '1.4rem', margin: '.3rem 0' } }, n.icon),
            h('div', { style: { fontSize: '.72rem', color: GOLD, fontWeight: 700 } }, n.name),
            h('div', { style: { fontSize: '.6rem', color: MUTED, marginTop: '.2rem' } }, n.ip),
          ))
        ),

        h('div', { style: { display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' } },
          [['services','🔧 Services'],['regles','🔥 Règles pfSense'],['terminal','💻 Terminal'],['tests','🧪 Tests réseau']].map(([k,l]) =>
            h('button', { key: k, style: tabStyle(tab===k), onClick: () => setTab(k) }, l)
          )
        ),

        tab === 'services' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Services actifs — Debian 12'),
          ...SERVICES.map((sv, i) => h('div', { key: i, style: rowStyle },
            h('span', null, h('span', { style: { color: CYAN, fontWeight: 700 } }, sv.name), h('span', { style: { color: DIM, marginLeft: '.4rem' } }, sv.ver)),
            h('span', { style: { color: MUTED, fontSize: '.65rem' } }, sv.detail),
            h('span', { style: { color: GREEN, fontSize: '.65rem' } }, '● actif · :' + sv.port),
          ))
        ),

        tab === 'regles' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Firewall / Rules — pfSense CE 2.7'),
          ...RULES.map((r, i) => h('div', { key: i, style: rowStyle },
            h('span', null, h('span', { style: { color: CYAN } }, r.src), ' → ', h('span', { style: { color: GOLD } }, r.dst), h('span', { style: { color: DIM } }, ' · ' + r.proto)),
            h('span', { style: { color: MUTED, fontSize: '.65rem' } }, r.detail),
            h('span', { style: { color: r.action === 'allow' ? GREEN : RED, fontWeight: 700, fontSize: '.65rem', textTransform: 'uppercase' } }, r.action),
          ))
        ),

        tab === 'terminal' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Terminal SSH — Debian 12 · 192.168.20.10'),
          h('div', { style: { fontSize: '.7rem', lineHeight: 1.9 } },
            ...LOGS.map((l, i) => h('div', { key: i, style: { color: l.t === 'ok' ? GREEN : l.t === 'warn' ? GOLD : CYAN } }, l.v))
          )
        ),

        tab === 'tests' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Tests réseau & sécurité'),
          h('div', { style: { display: 'flex', gap: '.5rem', marginBottom: '1rem' } },
            h('button', { style: btnStyle, onClick: runAll }, '▶▶ Lancer tous les tests'),
          ),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '.5rem' } },
            ...TESTS.map((t, i) => {
              const res = results[i];
              const isRunning = running === i;
              return h('div', { key: i, style: { background: BG_ROW, border: `1px solid ${res ? (res.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)') : `rgba(0,0,0,${jour?'.06':'.08'})`}`, borderRadius: '6px', padding: '.6rem .9rem', display: 'flex', flexDirection: 'column', gap: '.3rem' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  h('span', { style: { fontSize: '.72rem', color: CYAN } }, t.label),
                  h('button', { style: { ...btnStyle, padding: '.2rem .6rem', fontSize: '.62rem', opacity: running !== null ? .4 : 1 }, onClick: () => runTest(i), disabled: running !== null }, isRunning ? '⏳' : '▶'),
                ),
                res && h('span', { style: { fontSize: '.65rem', color: res.ok ? GREEN : RED } }, (res.ok ? '✓ ' : '✗ ') + res.result),
                isRunning && h('span', { style: { fontSize: '.65rem', color: DIM } }, '⏳ Test en cours…'),
              );
            })
          )
        ),
      );
    }

    window._reactDemoRoot = ReactDOM.createRoot(root);
    window._reactDemoRoot.render(h(LampDemo));
    return;
  }

  // ── DEMO ACTIVE DIRECTORY ──────────────────────────────────────
  if (project === 'ad') {
    const OU_DATA = {
      label: 'OU=Utilisateurs-SISR',
      users: ['jean.dupont (jean.dupont@sisr.local)', 'Marie Martine (marie.martine@sisr.local)'],
      groupe: 'GRP-Employes — Sécurité · Domaine local',
    };
    const INFRA = [
      { name: 'SRV-AD-01',  os: 'Windows Server 2022', ip: '192.168.2.10 — VMnet2 fixe', roles: ['AD DS', 'DNS', 'GPMC'] },
      { name: 'CLI-WIN-01', os: 'Windows 10 Pro',       ip: '192.168.2.20 — VMnet2 fixe', roles: ['Membre sisr.local']    },
    ];
    const GPO = { name: 'GPO-Employes', ou: 'OU=Utilisateurs-SISR', etat: 'Activée', effet: 'Interdire accès Panneau de configuration & Paramètres', filtre: 'Utilisateurs authentifiés' };
    const GPRESULT = [
      { t: 'ok',   v: 'PARAMÈTRES UTILISATEURS' },
      { t: 'cmd',  v: 'CN=jean dupont,OU=Utilisateurs-SISR,DC=sisr,DC=local' },
      { t: 'ok',   v: 'Dernière application GPO : 11/05/2026 à 02:23:47' },
      { t: 'ok',   v: 'Stratégie appliquée depuis : SRV-AD-01.sisr.local' },
      { t: 'ok',   v: 'Nom du domaine : SISR · Type : Windows 2008 ou supérieur' },
      { t: 'warn', v: 'Objets Stratégie de groupe appliqués :' },
      { t: 'ok',   v: '    GPO-Employes ✅' },
      { t: 'warn', v: "L'utilisateur fait partie des groupes :" },
      { t: 'ok',   v: '    GRP-Employes · Utilisateurs du domaine · Utilisateurs authentifiés' },
    ];
    const TESTS = [
      { label: 'Ping SRV-AD-01 depuis CLI-WIN-01',          delay: 800,  result: '4 packets tx, 4 received — 0% loss · DC joignable ✔',            ok: true  },
      { label: 'Résolution DNS sisr.local → 192.168.2.10',  delay: 700,  result: 'nslookup sisr.local → 192.168.2.10 · DNS AD fonctionnel ✔',       ok: true  },
      { label: 'Jonction domaine — CLI-WIN-01',              delay: 1400, result: 'Bienvenue dans le domaine sisr.local ✔',                           ok: true  },
      { label: 'Connexion jean.dupont@sisr.local',           delay: 1200, result: 'Auth Kerberos OK · Profil chargé · GPO appliquées ✔',              ok: true  },
      { label: 'Panneau de configuration (GPO active)',       delay: 600,  result: 'Accès refusé — GPO-Employes bloque Control.exe ✔',                ok: true  },
      { label: 'gpupdate /force sur CLI-WIN-01',             delay: 1000, result: 'La mise à jour de la stratégie ordinateur a réussi ✔',             ok: true  },
      { label: 'Appartenance GRP-Employes',                  delay: 500,  result: 'jean.dupont membre de GRP-Employes · Filtrage GPO actif ✔',        ok: true  },
    ];

    function AdDemo() {
      const [tab, setTab]         = useState('infra');
      const [ouOpen, setOuOpen]   = useState(true);
      const [result, setResult]   = useState(null);
      const [loading, setLoading] = useState(false);
      const [running, setRunning] = useState(null);
      const [testRes, setTestRes] = useState({});

      const simulate = () => {
        setLoading(true); setResult(null);
        setTimeout(() => { setResult(GPRESULT); setLoading(false); }, 1400);
      };

      const runTest = (i) => {
        if (running !== null) return;
        setRunning(i);
        setTimeout(() => { setTestRes(r => ({ ...r, [i]: TESTS[i] })); setRunning(null); }, TESTS[i].delay);
      };

      const runAll = () => {
        if (running !== null) return;
        TESTS.forEach((t, i) => setTimeout(() => setTestRes(r => ({ ...r, [i]: TESTS[i] })), t.delay + i * 250));
      };

      return h('div', { style: appStyle },
        h('p', { style: titleStyle }, '⚡ Simulation — Active Directory + GPO · sisr.local'),

        h('div', { style: { display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' } },
          [['infra','🖥️ Infrastructure'],['ou','🗂️ Arborescence AD'],['gpo','📋 GPO'],['verify','✅ gpresult /r'],['tests','🧪 Tests AD']].map(([k,l]) =>
            h('button', { key: k, style: tabStyle(tab===k), onClick: () => setTab(k) }, l)
          )
        ),

        tab === 'infra' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'VMs — VMware Workstation · VMnet2 192.168.2.0/24'),
          ...INFRA.map((m, i) => h('div', { key: i, style: { ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', gap: '.4rem' } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', width: '100%' } },
              h('span', { style: { color: GOLD, fontWeight: 700 } }, m.name),
              h('span', { style: { color: GREEN, fontSize: '.65rem' } }, '● En ligne'),
            ),
            h('span', { style: { color: MUTED, fontSize: '.65rem' } }, m.os + ' · ' + m.ip),
            h('div', { style: { display: 'flex', gap: '.4rem', flexWrap: 'wrap' } },
              ...m.roles.map((r, j) => h('span', { key: j, style: { fontSize: '.6rem', padding: '1px 6px', borderRadius: '4px', background: BG_ACCENT2, border: `1px solid ${BORDER_ACCENT}`, color: GOLD } }, r))
            ),
          ))
        ),

        tab === 'ou' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Utilisateurs et ordinateurs AD · sisr.local'),
          h('div', { style: { fontSize: '.8rem', color: GOLD, marginBottom: '.5rem' } }, '🏛️ DC=sisr,DC=local'),
          h('div', { style: { marginLeft: '1rem', borderLeft: `1px dashed ${BORDER_ACCENT2}`, paddingLeft: '.75rem' } },
            h('div', { style: { fontSize: '.78rem', color: CYAN, padding: '.25rem 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.5rem' }, onClick: () => setOuOpen(o => !o) },
              ouOpen ? '▼' : '▶', ' 📁 ', OU_DATA.label,
              h('span', { style: { fontSize: '.6rem', color: DIM, marginLeft: '.4rem' } }, '2 utilisateurs · 1 groupe')
            ),
            ouOpen && h('div', { style: { marginLeft: '1.2rem' } },
              ...OU_DATA.users.map((u, i) => h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.2rem 0', fontSize: '.7rem', color: MUTED } },
                h('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: GREEN, display: 'inline-block', flexShrink: 0 } }), '👤 ' + u,
              )),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.2rem 0', fontSize: '.7rem', color: MUTED } },
                h('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: GOLD, display: 'inline-block', flexShrink: 0 } }), '👥 ' + OU_DATA.groupe,
              ),
            ),
          )
        ),

        tab === 'gpo' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'GPMC · sisr.local'),
          h('div', { style: { ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', gap: '.4rem' } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', width: '100%' } },
              h('span', { style: { color: GOLD, fontWeight: 700 } }, GPO.name),
              h('span', { style: { color: GREEN, fontSize: '.65rem' } }, GPO.etat),
            ),
            h('span', { style: { color: MUTED, fontSize: '.65rem' } }, 'Liée à : ' + GPO.ou),
            h('span', { style: { color: MUTED, fontSize: '.65rem' } }, 'Effet : ' + GPO.effet),
            h('span', { style: { color: DIM, fontSize: '.6rem' } }, 'Filtre sécurité : ' + GPO.filtre),
          )
        ),

        tab === 'verify' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'gpresult /r — CLI-WIN-01 · Utilisateur : jean.dupont'),
          h('button', { style: { ...btnStyle, opacity: loading ? .5 : 1, marginBottom: '1rem' }, onClick: simulate, disabled: loading },
            loading ? '⏳ Exécution gpresult /r…' : '▶ Lancer gpresult /r'
          ),
          result && h('div', { style: { fontSize: '.7rem', lineHeight: 1.9 } },
            ...result.map((l, i) => h('div', { key: i, style: { color: l.t === 'ok' ? GREEN : l.t === 'warn' ? GOLD : CYAN } }, l.v))
          )
        ),

        tab === 'tests' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Tests Active Directory & GPO'),
          h('div', { style: { display: 'flex', gap: '.5rem', marginBottom: '1rem' } },
            h('button', { style: btnStyle, onClick: runAll }, '▶▶ Lancer tous les tests'),
          ),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '.5rem' } },
            ...TESTS.map((t, i) => {
              const res = testRes[i];
              return h('div', { key: i, style: { background: BG_ROW, border: `1px solid ${res ? 'rgba(34,197,94,.3)' : `rgba(0,0,0,${jour?'.06':'.08'})`}`, borderRadius: '6px', padding: '.6rem .9rem', display: 'flex', flexDirection: 'column', gap: '.3rem' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  h('span', { style: { fontSize: '.72rem', color: CYAN } }, t.label),
                  h('button', { style: { ...btnStyle, padding: '.2rem .6rem', fontSize: '.62rem', opacity: running !== null ? .4 : 1 }, onClick: () => runTest(i), disabled: running !== null }, running === i ? '⏳' : '▶'),
                ),
                res && h('span', { style: { fontSize: '.65rem', color: GREEN } }, '✓ ' + res.result),
              );
            })
          )
        ),
      );
    }

    window._reactDemoRoot = ReactDOM.createRoot(root);
    window._reactDemoRoot.render(h(AdDemo));
    return;
  }

  // ── DEMO K3S ───────────────────────────────────────────────────
  if (project === 'k3s') {
    const NODES = [
      { name: 'master',  ip: '192.168.110.10', role: 'Control Plane', icon: '👑', color: '#7c3aed' },
      { name: 'worker1', ip: '192.168.110.11', role: 'Worker',        icon: '⚙️', color: '#0891b2' },
      { name: 'worker2', ip: '192.168.110.12', role: 'Worker',        icon: '⚙️', color: '#0891b2' },
      { name: 'worker3', ip: '192.168.110.13', role: 'Worker',        icon: '⚙️', color: '#0891b2' },
    ];
    const STACK = [
      { name: 'K3s',          ver: 'v1.35.5',  role: 'Orchestrateur Kubernetes',   color: '#7c3aed' },
      { name: 'Longhorn',     ver: 'latest',   role: 'Stockage persistant (PVC)',   color: '#0891b2' },
      { name: 'Prometheus',   ver: 'stack',    role: 'Collecte métriques',          color: '#ea580c' },
      { name: 'Grafana',      ver: 'latest',   role: 'Dashboards temps réel',       color: '#f97316' },
      { name: 'Gitea',        ver: 'latest',   role: 'Forge Git auto-hébergée',     color: '#22c55e' },
      { name: 'ArgoCD',       ver: 'latest',   role: 'GitOps CD — sync auto',       color: '#6366f1' },
      { name: 'Harbor',       ver: 'latest',   role: 'Registry privée OCI',         color: '#0ea5e9' },
      { name: 'Trivy',        ver: 'latest',   role: 'Scan CVE images',             color: '#ef4444' },
      { name: 'Kyverno',      ver: 'latest',   role: 'Politiques sécurité (Admit.)', color: '#8b5cf6'},
      { name: 'MetalLB',      ver: 'latest',   role: 'Load Balancer bare-metal',    color: '#14b8a6' },
      { name: 'Cert-Manager', ver: 'latest',   role: 'TLS automatique',             color: '#64748b' },
      { name: 'Traefik',      ver: 'intégré',  role: 'Ingress Controller',          color: '#06b6d4' },
    ];
    const TESTS = [
      { label: 'kubectl get nodes',                       delay: 700,  result: '4 nœuds Ready v1.35.5+k3s1 · cluster opérationnel ✔',          ok: true  },
      { label: 'Ping inter-nœuds (master → worker1)',     delay: 500,  result: '0% packet loss · ~0.5ms · réseau Flannel OK ✔',                 ok: true  },
      { label: 'Longhorn — volumes Healthy',              delay: 1100, result: '2 volumes Healthy · 4 nœuds · 111 Gi dispo ✔',                  ok: true  },
      { label: 'Grafana dashboard K3s',                   delay: 900,  result: 'HTTP 200 · k3s.local · Dashboards K8s temps réel ✔',            ok: true  },
      { label: 'Gitea → ArgoCD sync auto',                delay: 1400, result: 'Sync auto < 3 min après commit · Healthy/Synced ✔',             ok: true  },
      { label: 'Harbor scan myapp:v1 (CVE)',              delay: 1200, result: 'CVE-2026-6732 Haute détectée · fix requis ✔',                   ok: true  },
      { label: 'Harbor scan myapp:v2 (post-fix)',         delay: 1000, result: 'Aucune vulnérabilité · image propre ✔',                         ok: true  },
      { label: 'Kyverno — pod root refusé',               delay: 800,  result: 'admission webhook denied · disallow-root-user ✔',               ok: true  },
      { label: 'MetalLB — Service LoadBalancer',          delay: 600,  result: 'EXTERNAL-IP: 192.168.110.101 assignée · accès LAN direct ✔',    ok: true  },
    ];
    const PIPELINE = [
      { step: 1, icon: '📝', label: 'git commit',       detail: 'Push code → Gitea (k3s.local)',              color: '#22c55e' },
      { step: 2, icon: '🔍', label: 'Trivy scan',       detail: 'Scan CVE image Docker automatique',           color: '#f97316' },
      { step: 3, icon: '📦', label: 'Harbor push',      detail: 'Image validée → registry privée Harbor',      color: '#0ea5e9' },
      { step: 4, icon: '🔄', label: 'ArgoCD sync',      detail: 'Détection changement → deploy cluster',       color: '#6366f1' },
      { step: 5, icon: '✅', label: 'Deploy OK',        detail: 'Pods Running · Ingress Traefik actif',         color: '#22c55e' },
    ];

    function K3sDemo() {
      const [tab, setTab]       = useState('cluster');
      const [running, setRunning] = useState(null);
      const [testRes, setTestRes] = useState({});
      const [pipeStep, setPipeStep] = useState(0);
      const [pipeRunning, setPipeRunning] = useState(false);

      const runTest = (i) => {
        if (running !== null) return;
        setRunning(i);
        setTimeout(() => { setTestRes(r => ({ ...r, [i]: TESTS[i] })); setRunning(null); }, TESTS[i].delay);
      };

      const runAll = () => {
        if (running !== null) return;
        TESTS.forEach((t, i) => setTimeout(() => setTestRes(r => ({ ...r, [i]: TESTS[i] })), t.delay + i * 200));
      };

      const runPipeline = () => {
        if (pipeRunning) return;
        setPipeRunning(true); setPipeStep(0);
        PIPELINE.forEach((_, i) => {
          setTimeout(() => {
            setPipeStep(i + 1);
            if (i === PIPELINE.length - 1) setPipeRunning(false);
          }, 800 * (i + 1));
        });
      };

      return h('div', { style: appStyle },
        h('p', { style: titleStyle }, '⚡ Simulation — Lab Kubernetes K3s · 4 nœuds · VMware'),

        h('div', { style: { display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' } },
          [['cluster','☸️ Cluster'],['stack','📦 Stack'],['pipeline','🔄 Pipeline GitOps'],['tests','🧪 Tests']].map(([k,l]) =>
            h('button', { key: k, style: tabStyle(tab===k), onClick: () => setTab(k) }, l)
          )
        ),

        tab === 'cluster' && h('div', null,
          h('div', { style: panelStyle },
            h('div', { style: ptitleStyle }, 'Nœuds — VMnet11 · 192.168.110.0/24'),
            h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '.75rem' } },
              ...NODES.map(n => h('div', { key: n.name, style: { background: BG_ROW, border: `2px solid ${n.color}40`, borderRadius: '8px', padding: '.9rem', textAlign: 'center' } },
                h('div', { style: { fontSize: '1.5rem', marginBottom: '.3rem' } }, n.icon),
                h('div', { style: { color: n.color, fontWeight: 700, fontSize: '.78rem' } }, n.name),
                h('div', { style: { color: MUTED, fontSize: '.65rem' } }, n.ip),
                h('div', { style: { fontSize: '.58rem', marginTop: '.3rem', padding: '1px 6px', borderRadius: '4px', background: `${n.color}20`, color: n.color, display: 'inline-block' } }, n.role),
                h('div', { style: { fontSize: '.58rem', color: GREEN, marginTop: '.3rem' } }, '● Ready · v1.35.5+k3s1'),
              ))
            )
          ),
          h('div', { style: { ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', textAlign: 'center' } },
            [['4', 'Nœuds Ready'], ['111 Gi', 'Stockage Longhorn'], ['192.168.110.101', 'IP MetalLB']].map(([v, l]) =>
              h('div', { key: l },
                h('div', { style: { fontSize: '1.1rem', color: GOLD, fontWeight: 700, fontFamily: "'Orbitron',sans-serif" } }, v),
                h('div', { style: { fontSize: '.62rem', color: MUTED, marginTop: '.2rem' } }, l),
              )
            )
          )
        ),

        tab === 'stack' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Stack déployée via Helm · ' + STACK.length + ' composants'),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '.5rem' } },
            ...STACK.map((s, i) => h('div', { key: i, style: { background: BG_ROW, border: `1px solid ${s.color}40`, borderRadius: '6px', padding: '.6rem .8rem', display: 'flex', alignItems: 'center', gap: '.6rem' } },
              h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0, display: 'inline-block' } }),
              h('div', null,
                h('div', { style: { fontSize: '.72rem', color: CYAN, fontWeight: 700 } }, s.name, h('span', { style: { color: DIM, fontWeight: 400, marginLeft: '.4rem' } }, s.ver)),
                h('div', { style: { fontSize: '.6rem', color: MUTED } }, s.role),
              )
            ))
          )
        ),

        tab === 'pipeline' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Pipeline DevSecOps — GitOps avec Gitea + ArgoCD + Harbor + Trivy'),
          h('button', { style: { ...btnStyle, marginBottom: '1.25rem', opacity: pipeRunning ? .5 : 1 }, onClick: runPipeline, disabled: pipeRunning },
            pipeRunning ? '⏳ Pipeline en cours…' : '▶ Simuler un déploiement'
          ),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '.6rem' } },
            ...PIPELINE.map((p, i) => {
              const done = pipeStep > i;
              const active = pipeStep === i + 1 && pipeRunning;
              return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '.75rem', background: BG_ROW, border: `1px solid ${done ? p.color + '60' : `rgba(0,0,0,${jour?'.05':'.06'})`}`, borderRadius: '6px', padding: '.65rem .9rem', transition: 'border-color .3s' } },
                h('span', { style: { fontSize: '1.1rem', opacity: done || active ? 1 : .3 } }, p.icon),
                h('div', { style: { flex: 1 } },
                  h('div', { style: { fontSize: '.72rem', color: done ? p.color : MUTED, fontWeight: done ? 700 : 400 } }, p.label),
                  h('div', { style: { fontSize: '.62rem', color: DIM } }, p.detail),
                ),
                h('span', { style: { fontSize: '.65rem', color: done ? GREEN : active ? GOLD : DIM } }, done ? '✓' : active ? '⏳' : '○'),
              );
            })
          )
        ),

        tab === 'tests' && h('div', { style: panelStyle },
          h('div', { style: ptitleStyle }, 'Tests cluster & sécurité'),
          h('div', { style: { display: 'flex', gap: '.5rem', marginBottom: '1rem' } },
            h('button', { style: btnStyle, onClick: runAll }, '▶▶ Lancer tous les tests'),
          ),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '.5rem' } },
            ...TESTS.map((t, i) => {
              const res = testRes[i];
              return h('div', { key: i, style: { background: BG_ROW, border: `1px solid ${res ? 'rgba(34,197,94,.3)' : `rgba(0,0,0,${jour?'.06':'.08'})`}`, borderRadius: '6px', padding: '.6rem .9rem', display: 'flex', flexDirection: 'column', gap: '.3rem' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  h('span', { style: { fontSize: '.72rem', color: CYAN } }, t.label),
                  h('button', { style: { ...btnStyle, padding: '.2rem .6rem', fontSize: '.62rem', opacity: running !== null ? .4 : 1 }, onClick: () => runTest(i), disabled: running !== null }, running === i ? '⏳' : '▶'),
                ),
                res && h('span', { style: { fontSize: '.65rem', color: GREEN } }, '✓ ' + res.result),
              );
            })
          )
        ),
      );
    }

    window._reactDemoRoot = ReactDOM.createRoot(root);
    window._reactDemoRoot.render(h(K3sDemo));
    return;
  }
}
