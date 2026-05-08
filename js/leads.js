// ── Lead Capture Modal ────────────────────────────────────────────────────────
// Appears 2.5s after landing on homepage. Skipped if already submitted.

const LEADS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9FiVGTH7RmZYNvrRjQp8wi4bRN2Av84fhkVErKU4jgDB7Mpo4Y5SUhTqeKaTwYOit/exec';
const STORAGE_KEY = 'cdl_lead_captured';

function sendLead(params) {
  return fetch(`${LEADS_SCRIPT_URL}?${params}`, { mode: 'no-cors' });
}

function showModal() {
  const overlay = document.getElementById('lead-overlay');
  if (!overlay) return;
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('lead-overlay');
  if (!overlay) return;
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Don't show if already captured or dismissed
  if (localStorage.getItem(STORAGE_KEY)) return;

  const overlay = document.getElementById('lead-overlay');
  if (!overlay) return;

  // Show after 2.5 seconds
  setTimeout(showModal, 2500);

  // Close on overlay click (outside modal)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      localStorage.setItem(STORAGE_KEY, 'skipped');
      closeModal();
    }
  });

  // Close button
  document.getElementById('lead-close').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'skipped');
    closeModal();
  });

  // Skip link
  document.getElementById('lead-skip').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'skipped');
    closeModal();
  });

  // Form submit
  document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name  = document.getElementById('lead-name').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();

    const submitBtn = document.getElementById('lead-submit');
    submitBtn.textContent = 'Entering the circle…';
    submitBtn.disabled = true;

    const params = new URLSearchParams({ action: 'lead', name, email, phone });
    await sendLead(params);

    // Track in GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'lead_captured', { name, method: 'homepage_popup' });
    }

    // Save to localStorage so modal doesn't show again
    localStorage.setItem(STORAGE_KEY, 'submitted');

    // Show success state
    document.getElementById('lead-form-wrap').style.display = 'none';
    const success = document.getElementById('lead-success');
    success.style.display = 'flex';

    // Auto-close after 2.5s
    setTimeout(closeModal, 2500);
  });
});
