// ── Testimonials — load from Sheet + submit form ───────────────────────────

// Paste your deployed Apps Script URL here (same script handles leads + reviews)
const TESTIMONIALS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9FiVGTH7RmZYNvrRjQp8wi4bRN2Av84fhkVErKU4jgDB7Mpo4Y5SUhTqeKaTwYOit/exec'; // ← update this

// After deploying the Apps Script and the "Testimonials" tab appears in your sheet:
// 1. Go to File → Share → Publish to web
// 2. Choose the "Testimonials" tab → CSV → Publish
// 3. Copy the URL and paste it below (replace the full string)
const TESTIMONIALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRutoXtvjtSLyUtOnxNr4q5tpPJ1bEmGzR_c2YGQp4JUejKkJvUJri7fU7cGvLG94Ba0T7gyWljadp7/pub?gid=389019848&single=true&output=csv';

// ── CSV Parser — handles quoted fields containing commas AND newlines ──────
// Sheet columns: Name | City | Feedback | Approved | Timestamp
function parseTestimonials(csv) {
  const rows = [];
  let i = 0;
  const len = csv.length;

  while (i < len) {
    const cols = [];
    // parse one row
    while (i < len) {
      let field = '';
      if (csv[i] === '"') {
        i++; // skip opening quote
        while (i < len) {
          if (csv[i] === '"' && csv[i + 1] === '"') { field += '"'; i += 2; }
          else if (csv[i] === '"') { i++; break; } // closing quote
          else { field += csv[i++]; }
        }
      } else {
        while (i < len && csv[i] !== ',' && csv[i] !== '\n' && csv[i] !== '\r') {
          field += csv[i++];
        }
      }
      cols.push(field.trim());
      if (csv[i] === ',') { i++; continue; } // next field
      if (csv[i] === '\r') i++;              // skip \r
      if (csv[i] === '\n') i++;              // end of row
      break;
    }
    if (cols.length > 1) rows.push(cols);
  }

  return rows
    .slice(1) // skip header
    .map(cols => ({
      name:     cols[0] || '',
      city:     cols[1] || '',
      text:     cols[2] || '',
      approved: cols[3] || ''
    }))
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

function submitTestimonial(data) {
  const params = new URLSearchParams({
    action: 'testimonial',
    name: data.name,
    city: data.city,
    text: data.text
  });
  return fetch(`${TESTIMONIALS_SCRIPT_URL}?${params}`, { mode: 'no-cors' });
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
      await submitTestimonial({ name, city, text });
    } catch { /* show thanks anyway */ }

    form.style.display = 'none';
    thanks.style.display = 'flex';
    if (typeof gtag !== 'undefined') {
      gtag('event', 'testimonial_submitted', { name, city });
    }
  });
}
