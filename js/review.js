// ── Review Page — form submission to Google Apps Script ───────────────────────

// Paste your deployed Apps Script URL here (same URL as in testimonials.js)
const REVIEW_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE'; // ← update this

function submitReviewJSONP(data) {
  return new Promise((resolve, reject) => {
    const cbName = 'cdl_rev_cb_' + Date.now();
    const script = document.createElement('script');
    const params = new URLSearchParams({
      action: 'testimonial',
      name: data.name,
      city: data.city,
      text: data.text,
      callback: cbName
    });

    window[cbName] = (resp) => {
      delete window[cbName];
      document.body.removeChild(script);
      resp && resp.status === 'ok' ? resolve() : reject(new Error('script error'));
    };

    script.onerror = () => {
      delete window[cbName];
      try { document.body.removeChild(script); } catch {}
      reject(new Error('load error'));
    };

    script.src = `${REVIEW_SCRIPT_URL}?${params}`;
    document.body.appendChild(script);

    setTimeout(() => {
      if (window[cbName]) {
        delete window[cbName];
        try { document.body.removeChild(script); } catch {}
        reject(new Error('timeout'));
      }
    }, 10000);
  });
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
      if (!REVIEW_SCRIPT_URL.includes('YOUR_APPS_SCRIPT')) {
        await submitReviewJSONP({ name, city, text });
      }
    } catch {
      // Show thanks regardless — don't leave user hanging on a network error
    }

    form.style.display = 'none';
    nameOut.innerHTML = `thank you, <em>${name.split(' ')[0].toLowerCase()}</em>.`;
    thanks.style.display = 'flex';

    if (typeof gtag !== 'undefined') {
      gtag('event', 'review_submitted', { name, city });
    }
  });
});
