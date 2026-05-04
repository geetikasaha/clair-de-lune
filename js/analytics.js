// ── Clair de Lune — GA4 Funnel Event Tracking ────────────────────────────────

function trackEvent(name, params) {
  if (typeof gtag === 'undefined') return;
  gtag('event', name, params || {});
}

document.addEventListener('DOMContentLoaded', () => {

  // ── Homepage / nav CTAs ──────────────────────────────────────────────────
  document.querySelectorAll('a[href="book.html"]').forEach(btn => {
    btn.addEventListener('click', () =>
      trackEvent('begin_booking', { button_text: btn.textContent.trim() }));
  });

  document.querySelectorAll('a[href="services.html"]').forEach(btn => {
    btn.addEventListener('click', () => trackEvent('view_services'));
  });

  document.querySelectorAll('a[href="about.html"]').forEach(btn => {
    btn.addEventListener('click', () => trackEvent('view_about'));
  });

  // ── WhatsApp buttons ─────────────────────────────────────────────────────
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', () => trackEvent('whatsapp_float_click'));
  }

  const navWa = document.querySelector('.nav-wa');
  if (navWa) {
    navWa.addEventListener('click', () => trackEvent('whatsapp_nav_click'));
  }

});
