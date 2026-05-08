// Scroll effect
const navEl = document.querySelector('nav.nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Active link highlight (runs after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('?')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.style.color = 'var(--accent)';
    }
  });
});

// Hamburger — event delegation so it works with React-rendered navs too
document.addEventListener('click', (e) => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  if (e.target.closest('.hamburger')) {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  } else if (!e.target.closest('.nav-links')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});
