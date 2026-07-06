/* MTC Spain Solicitors — cookie consent + GA4 (Google Consent Mode v2)
   Analytics is DENIED by default and only loads after the visitor clicks Accept.
   To turn analytics on: replace GA_ID below with the real GA4 Measurement ID (G-XXXXXXXXXX).
   Until then the banner works but no analytics is loaded. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';                       // <-- replace with real GA4 ID
  var GA_ENABLED = GA_ID.indexOf('XXXX') === -1;     // stays off while placeholder
  var KEY = 'mtc_cookie_consent';
  var isES = (document.documentElement.lang || 'en').toLowerCase().indexOf('es') === 0;

  var T = isES ? {
    body: 'Usamos cookies esenciales para el funcionamiento del sitio y, solo con tu consentimiento, cookies de analítica para ver cómo se usa.',
    policy: 'Política de cookies',
    policyHref: '/es/cookies.html',
    accept: 'Aceptar',
    decline: 'Rechazar',
    settings: 'Configuración de cookies'
  } : {
    body: 'We use essential cookies to run this site and, only with your consent, analytics cookies to see how it is used.',
    policy: 'Cookie policy',
    policyHref: '/cookies.html',
    accept: 'Accept',
    decline: 'Decline',
    settings: 'Cookie settings'
  };

  // --- Google Consent Mode: default everything denied ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function loadGA() {
    if (!GA_ENABLED || document.getElementById('ga4-lib')) return;
    var s = document.createElement('script');
    s.id = 'ga4-lib'; s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }
  function grant() { gtag('consent', 'update', { analytics_storage: 'granted' }); loadGA(); }

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // apply a prior "accepted" choice immediately
  if (read() === 'accepted') grant();

  // --- build the banner ---
  var banner;
  function buildBanner() {
    if (banner) { banner.classList.add('show'); return; }
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookies');
    var txt = document.createElement('p');
    txt.className = 'cookie-text';
    txt.appendChild(document.createTextNode(T.body + ' '));
    var a = document.createElement('a');
    a.href = T.policyHref; a.textContent = T.policy;
    txt.appendChild(a);
    var btns = document.createElement('div');
    btns.className = 'cookie-btns';
    var decline = document.createElement('button');
    decline.className = 'cookie-btn cookie-decline'; decline.textContent = T.decline;
    var accept = document.createElement('button');
    accept.className = 'cookie-btn cookie-accept'; accept.textContent = T.accept;
    decline.addEventListener('click', function () { store('declined'); hide(); });
    accept.addEventListener('click', function () { store('accepted'); grant(); hide(); });
    btns.appendChild(decline); btns.appendChild(accept);
    banner.appendChild(txt); banner.appendChild(btns);
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('show'); });
  }
  function hide() { if (banner) banner.classList.remove('show'); }

  // show banner if no choice yet
  if (!read()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildBanner);
    else buildBanner();
  }

  // --- "Cookie settings" link in the footer, to re-open the banner ---
  function addSettingsLink() {
    var base = document.querySelector('footer .base');
    if (!base || base.querySelector('.cookie-settings')) return;
    var wrap = document.createElement('span');
    var link = document.createElement('a');
    link.href = '#'; link.className = 'cookie-settings'; link.textContent = T.settings;
    link.addEventListener('click', function (e) { e.preventDefault(); buildBanner(); });
    wrap.appendChild(link);
    base.appendChild(wrap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addSettingsLink);
  else addSettingsLink();
})();
