let selectedService = null;
let selectedSlot = null;
let liveSlots = [];

const WA_NUMBER = '917999634730';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0MXRboqA1jtrPMaIKo9lhaJujOLWdGJUzyFYe1glAjodT-1SBqVXgYOpJm_LDHafLp-tx3hPnkHhu/pub?gid=0&single=true&output=csv';

function showStep(n) {
  document.querySelectorAll('.booking-section').forEach(el => {
    el.classList.toggle('active', el.dataset.step == n);
  });
  document.querySelectorAll('.step-indicator').forEach(el => {
    el.classList.toggle('active', +el.dataset.step <= n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function parseCSV(text) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lines = text.trim().split('\n').slice(1); // skip header row
  return lines
    .map(line => line.split(',').map(c => c.trim().replace(/^"|"$/g, '')))
    .filter(cols => {
      if (cols.length < 4 || cols[3].toUpperCase() !== 'TRUE') return false;
      // Date format from sheet: DD/MM/YYYY
      const [d, m, y] = cols[0].split('/');
      const slotDate = new Date(+y, +m - 1, +d);
      return slotDate >= today;
    })
    .map(cols => ({ date: cols[0], day: cols[1], time: cols[2] }));
}

// ── Step 1: Services ──────────────────────────────────────────────────────────
function renderServices() {
  const container = document.getElementById('service-options');
  container.innerHTML = SERVICES.map(s => `
    <div class="service-option" data-id="${s.id}" onclick="selectService('${s.id}')">
      <h4>${s.name}</h4>
      <p class="svc-desc">${s.description}</p>
      <div class="price">₹${s.price.toLocaleString('en-IN')}</div>
      <div class="duration">${s.duration}</div>
    </div>
  `).join('');
}

function selectService(id) {
  selectedService = SERVICES.find(s => s.id === id);
  document.querySelectorAll('.service-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
  });
  document.getElementById('btn-to-step2').disabled = false;
  if (typeof gtag !== 'undefined') {
    gtag('event', 'service_selected', { service_name: selectedService.name, value: selectedService.price });
  }
}

document.getElementById('btn-to-step2').addEventListener('click', async () => {
  if (!selectedService) return;
  await loadAndRenderSlots();
  showStep(2);
});

// ── Step 2: Slots ─────────────────────────────────────────────────────────────
async function loadAndRenderSlots() {
  const container = document.getElementById('slots-grid');
  const btn3 = document.getElementById('btn-to-step3');
  btn3.disabled = true;
  btn3.style.display = '';

  container.innerHTML = '<div class="slots-loading"><span class="slots-spinner"></span> Checking availability…</div>';

  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error('fetch failed');
    const text = await res.text();
    liveSlots = parseCSV(text);
  } catch {
    container.innerHTML = `
      <div class="no-slots">
        Could not load slots right now.<br>
        <a href="https://wa.me/${WA_NUMBER}" target="_blank" style="color:var(--gold);">Reach out on WhatsApp</a> to book.
      </div>`;
    btn3.style.display = 'none';
    return;
  }

  if (!liveSlots.length) {
    container.innerHTML = '<div class="no-slots">No slots available right now.<br>Check back soon or reach out on WhatsApp.</div>';
    btn3.style.display = 'none';
    return;
  }

  container.innerHTML = liveSlots.map((slot, i) => `
    <button class="slot-btn" data-index="${i}" onclick="selectSlot(${i})">
      <div class="slot-date">${slot.day}</div>
      <div class="slot-time">${slot.time}</div>
    </button>
  `).join('');
}

function selectSlot(index) {
  selectedSlot = liveSlots[index];
  document.querySelectorAll('.slot-btn').forEach(el => {
    el.classList.toggle('selected', +el.dataset.index === index);
  });
  document.getElementById('btn-to-step3').disabled = false;
  if (typeof gtag !== 'undefined') {
    gtag('event', 'slot_selected', { slot_day: selectedSlot.day, slot_time: selectedSlot.time });
  }
}

document.getElementById('btn-back-1').addEventListener('click', () => showStep(1));
document.getElementById('btn-to-step3').addEventListener('click', () => {
  if (!selectedSlot) return;
  updateSummary();
  showStep(3);
});

// ── Step 3: Confirm ───────────────────────────────────────────────────────────
function updateSummary() {
  document.getElementById('summary-service').textContent = selectedService.name;
  document.getElementById('summary-slot').textContent = `${selectedSlot.day} at ${selectedSlot.time}`;
  document.getElementById('summary-price').textContent = `₹${selectedService.price.toLocaleString('en-IN')}`;
}

document.getElementById('btn-back-2').addEventListener('click', () => showStep(2));

document.getElementById('btn-confirm').addEventListener('click', () => {
  const name = document.getElementById('user-name').value.trim() || 'a visitor';
  const msg = encodeURIComponent(
    `Hi Geetika! 🌙\n\n` +
    `I'd like to book a session with Clair de Lune.\n\n` +
    `Name: ${name}\n` +
    `Service: ${selectedService.name}\n` +
    `Slot: ${selectedSlot.day} at ${selectedSlot.time}\n` +
    `Amount: ₹${selectedService.price.toLocaleString('en-IN')}\n\n` +
    `Please confirm my booking!`
  );
  if (typeof gtag !== 'undefined') {
    gtag('event', 'conversion', {
      event_category: 'booking',
      service_name: selectedService.name,
      value: selectedService.price,
      currency: 'INR'
    });
  }

  // Save pending booking so we can show waiting screen on return
  localStorage.setItem('cdl_pending_booking', JSON.stringify({
    name,
    service: selectedService.name,
    slot: `${selectedSlot.day} at ${selectedSlot.time}`,
    price: `₹${selectedService.price.toLocaleString('en-IN')}`,
    sentAt: Date.now()
  }));

  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');

  // Show the pending screen after a short delay (user returns to tab)
  setTimeout(showPendingScreen, 800);
});

// ── Pending confirmation screen ───────────────────────────────────────────────
function showPendingScreen() {
  const pending = JSON.parse(localStorage.getItem('cdl_pending_booking') || 'null');
  if (!pending) return;

  document.getElementById('booking-flow').style.display = 'none';
  const screen = document.getElementById('booking-pending');
  screen.style.display = 'block';
  document.getElementById('pending-service').textContent = pending.service;
  document.getElementById('pending-slot').textContent    = pending.slot;
  document.getElementById('pending-price').textContent   = pending.price;
}

document.getElementById('btn-new-booking').addEventListener('click', () => {
  localStorage.removeItem('cdl_pending_booking');
  document.getElementById('booking-pending').style.display = 'none';
  document.getElementById('booking-flow').style.display    = 'block';
  selectedService = null;
  selectedSlot    = null;
  renderServices();
  showStep(1);
});

// ── Init ──────────────────────────────────────────────────────────────────────
const preselect = new URLSearchParams(location.search).get('service');

let pendingBooking = JSON.parse(localStorage.getItem('cdl_pending_booking') || 'null');

// Auto-expire pending booking after 24 hours
if (pendingBooking && Date.now() - pendingBooking.sentAt > 24 * 60 * 60 * 1000) {
  localStorage.removeItem('cdl_pending_booking');
  pendingBooking = null;
}

// If user explicitly chose a service (via URL param), always start a fresh booking
if (preselect && SERVICES.find(s => s.id === preselect)) {
  renderServices();
  selectService(preselect);
  showStep(2);
  loadAndRenderSlots();
} else if (pendingBooking) {
  showPendingScreen();
} else {
  renderServices();
  showStep(1);
}
