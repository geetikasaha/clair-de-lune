// ── Testimonials — load from Sheet + submit form ───────────────────────────

// Paste your deployed Apps Script URL here (same script handles leads + reviews)
const TESTIMONIALS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9FiVGTH7RmZYNvrRjQp8wi4bRN2Av84fhkVErKU4jgDB7Mpo4Y5SUhTqeKaTwYOit/exec'; // ← update this

// After deploying the Apps Script and the "Testimonials" tab appears in your sheet:
// 1. Go to File → Share → Publish to web
// 2. Choose the "Testimonials" tab → CSV → Publish
// 3. Copy the URL and paste it below (replace the full string)
const TESTIMONIALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRutoXtvjtSLyUtOnxNr4q5tpPJ1bEmGzR_c2YGQp4JUejKkJvUJri7fU7cGvLG94Ba0T7gyWljadp7/pub?gid=1667636216&single=true&output=csv';

// ── CSV Parser (handles quoted fields with commas inside) ──────────────────
function parseCSVLine(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      cols.push(cur.trim()); cur = '';
    } else {
      cur += c;
    }
  }
  cols.push(cur.trim());
  return cols;
}

// Sheet columns (from apps-script.gs): Name | City | Feedback | Approved | Timestamp
function parseTestimonials(csv) {
  const lines = csv.trim().split('\n').slice(1); // skip header row
  return lines
    .map(line => {
      const cols = parseCSVLine(line);
      return {
        name:     cols[0] || '',
        city:     cols[1] || '',
        text:     cols[2] || '',
        approved: cols[3] || ''
      };
    })
    .filter(r => r.approved.toUpperCase() === 'TRUE' && r.text.length > 0);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTestimonials(list) {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '';
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

async function loadTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  if (TESTIMONIALS_CSV_URL.includes('YOUR_TESTIMONIALS')) {
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
      try { document.body.removeChild(script); } catch {}
      resp && resp.status === 'ok' ? resolve() : reject(new Error('apps script error'));
    };

    script.onerror = () => {
      delete window[cbName];
      try { document.body.removeChild(script); } catch {}
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
    }, 10000);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadTestimonials();

const btnOpen  = document.getElementById('btn-open-testimonial');
const formWrap = document.getElementById('testimonial-form-wrap');
const form     = document.getElementById('testimonial-form');
const thanks   = document.getElementById('testimonial-thanks');
const submitBtn = document.getElementById('t-submit');

if (btnOpen && formWrap) {
  btnOpen.addEventListener('click', () => {
    const open = formWrap.style.display !== 'none';
    formWrap.style.display = open ? 'none' : 'block';
    if (!open) formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    submitBtn.textContent = 'sending…';

    try {
      if (!TESTIMONIALS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT')) {
        await submitTestimonialJSONP({ name, city, text });
      }
    } catch { /* show thanks anyway */ }

    form.style.display = 'none';
    thanks.style.display = 'flex';
    if (typeof gtag !== 'undefined') {
      gtag('event', 'testimonial_submitted', { name, city });
    }
  });
}
