// ── Review Page — form submission to Google Apps Script ───────────────────────

const REVIEW_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9FiVGTH7RmZYNvrRjQp8wi4bRN2Av84fhkVErKU4jgDB7Mpo4Y5SUhTqeKaTwYOit/exec';

function submitReview(data) {
  const params = new URLSearchParams({
    action: 'testimonial',
    name: data.name,
    city: data.city,
    text: data.text
  });
  // no-cors: browser sends the request, Apps Script writes to Sheet,
  // response is opaque — we don't need to read it
  return fetch(`${REVIEW_SCRIPT_URL}?${params}`, { mode: 'no-cors' });
}

document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('review-form');
  const thanks  = document.getElementById('review-thanks');
  const nameOut = document.getElementById('review-thanks-name');
  const btn     = document.getElementById('review-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('r-name').value.trim();
    const city = document.getElementById('r-city').value.trim();
    const text = document.getElementById('r-text').value.trim();
    if (!name || !city || !text) return;

    btn.disabled = true;
    btn.textContent = 'sending…';

    try {
      await submitReview({ name, city, text });
    } catch {
      // network error — still show thanks, entry may have gone through
    }

    form.style.display = 'none';
    nameOut.innerHTML = `thank you, <em>${name.split(' ')[0].toLowerCase()}</em>.`;
    thanks.style.display = 'flex';

    if (typeof gtag !== 'undefined') {
      gtag('event', 'review_submitted', { name, city });
    }
  });
});
