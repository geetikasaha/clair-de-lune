// Replace with your deployed Apps Script URL (same script as leads, add 'testimonial' action support)
const TESTIMONIALS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

// Published CSV for the Testimonials sheet tab (gid must match your sheet tab)
// Replace the gid= value with the gid of your Testimonials tab
const TESTIMONIALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1vgCy4u3R4Lg6jCKDJ_kIuFlXIGoxungXmr283KAzYh4/pub?gid=TESTIMONIALS_GID&single=true&output=csv';

function parseTestimonials(csv) {
  const lines = csv.trim().split('\n').slice(1);
  return lines
    .map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return { name: cols[0], city: cols[1], text: cols[2], approved: cols[3] };
    })
    .filter(r => r.approved && r.approved.toUpperCase() === 'TRUE' && r.text);
}

function renderTestimonials(list) {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:2rem;">Be the first to share your experience.</p>';
    return;
  }

  grid.innerHTML = list.map(t => `
    <div class="testimonial-card fade-up">
      <p class="testimonial-text">${escapeHtml(t.text)}</p>
      <div class="testimonial-author">${escapeHtml(t.name)}</div>
      <div class="testimonial-city">${escapeHtml(t.city)}</div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function loadTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  // Skip fetch if URL is still placeholder
  if (TESTIMONIALS_CSV_URL.includes('TESTIMONIALS_GID')) {
    grid.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(TESTIMONIALS_CSV_URL);
    if (!res.ok) throw new Error('fetch failed');
    const text = await res.text();
    renderTestimonials(parseTestimonials(text));
  } catch {
    grid.innerHTML = '';
  }
}

function submitTestimonialJSONP(data) {
  return new Promise((resolve, reject) => {
    const cbName = 'cdl_t_cb_' + Date.now();
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
      resp && resp.status === 'ok' ? resolve() : reject(new Error('apps script error'));
    };

    script.onerror = () => {
      delete window[cbName];
      document.body.removeChild(script);
      reject(new Error('script load error'));
    };

    script.src = `${TESTIMONIALS_SCRIPT_URL}?${params}`;
    document.body.appendChild(script);
    setTimeout(() => {
      if (window[cbName]) {
        delete window[cbName];
        try { document.body.removeChild(script); } catch {}
        reject(new Error('timeout'));
      }
    }, 8000);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadTestimonials();

const btnOpen = document.getElementById('btn-open-testimonial');
const formWrap = document.getElementById('testimonial-form-wrap');
const form = document.getElementById('testimonial-form');
const thanks = document.getElementById('testimonial-thanks');
const submitBtn = document.getElementById('t-submit');

if (btnOpen && formWrap) {
  btnOpen.addEventListener('click', () => {
    formWrap.style.display = formWrap.style.display === 'none' ? 'block' : 'none';
    if (formWrap.style.display === 'block') {
      formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('t-name').value.trim();
    const city = document.getElementById('t-city').value.trim();
    const text = document.getElementById('t-text').value.trim();
    if (!name || !city || !text) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      if (!TESTIMONIALS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT')) {
        await submitTestimonialJSONP({ name, city, text });
      }
      form.style.display = 'none';
      thanks.style.display = 'flex';
      if (typeof gtag !== 'undefined') {
        gtag('event', 'testimonial_submitted', { name, city });
      }
    } catch {
      form.style.display = 'none';
      thanks.style.display = 'flex';
    }
  });
}
