// ── Floating firefly particles ────────────────────────────────────────────────
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 1.5 + Math.random() * 2.5;
    p.style.left            = Math.random() * 100 + '%';
    p.style.top             = (10 + Math.random() * 80) + '%';
    p.style.width           = size + 'px';
    p.style.height          = size + 'px';
    p.style.animationDelay    = (Math.random() * 12) + 's';
    p.style.animationDuration = (9 + Math.random() * 9) + 's';
    hero.appendChild(p);
  }
}

// ── Hero text staggered reveal ────────────────────────────────────────────────
function initHeroReveal() {
  const selectors = [
    '.hero-moon', '.hero h1', '.hero-subtitle',
    '.hero-divider', '.hero-tagline', '.btn-group', '.hero-scroll'
  ];

  selectors.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;

    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';

    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 150 + i * 130);
  });
}

// ── Scroll-triggered fade-up ──────────────────────────────────────────────────
function initScrollAnimations() {
  // Cards — staggered per position in grid
  document.querySelectorAll('.card').forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  // Other content blocks
  document.querySelectorAll(
    '.about-content p, .about-content h2, .about-highlight, .about-quote'
  ).forEach(el => el.classList.add('fade-up'));

  // Observe all fade-up elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  // Small delay so elements start hidden before being observed
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }, 200);
}

// ── Parallax on hero content ──────────────────────────────────────────────────
function initParallax() {
  const content = document.querySelector('.hero-content');
  if (!content) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    content.style.transform = 'translateY(' + (y * 0.22) + 'px)';
    content.style.opacity   = Math.max(0, 1 - y / 500);
  }, { passive: true });
}

// ── Gold cursor glow (desktop only) ──────────────────────────────────────────
function initCursorGlow() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', e => {
    const rect  = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHeroReveal();
  initScrollAnimations();
  initParallax();
  initCursorGlow();
});
