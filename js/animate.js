// ── Floating firefly particles in hero ────────────────────────────────────────
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 1 + Math.random() * 2.5;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      top:${10 + Math.random() * 80}%;
      width:${size}px;
      height:${size}px;
      animation-delay:${Math.random() * 12}s;
      animation-duration:${9 + Math.random() * 9}s;
    `;
    hero.appendChild(p);
  }
}

// ── Parallax hero content on scroll ──────────────────────────────────────────
function initParallax() {
  const content = document.querySelector('.hero-content');
  if (!content) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    content.style.transform = `translateY(${y * 0.22}px)`;
    content.style.opacity   = String(Math.max(0, 1 - y / 480));
  }, { passive: true });
}

// ── Scroll-triggered fade-up ──────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card').forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll(
    '.about-content p, .about-content h2, .about-highlight, .about-quote, .fade-up'
  ).forEach(el => {
    if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
    observer.observe(el);
  });
}

// ── Gold cursor glow on hero (desktop only) ───────────────────────────────────
function initCursorGlow() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top  = `${e.clientY - rect.top}px`;
  });
}

// ── Staggered hero text reveal on load ───────────────────────────────────────
function initHeroReveal() {
  const targets = document.querySelectorAll(
    '.hero-moon, .hero h1, .hero-subtitle, .hero-divider, .hero-tagline, .btn-group, .hero-scroll'
  );
  targets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.9s ease, transform 0.9s ease`;
    el.style.transitionDelay = `${0.15 + i * 0.13}s`;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '';
      el.style.transform = '';
    }));
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initParallax();
  initScrollAnimations();
  initCursorGlow();
  initHeroReveal();
});
