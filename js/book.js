let selectedService = null;
let selectedSlot = null;
let currentStep = 1;

const WA_NUMBER = '917999634730';

function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.booking-section').forEach(el => {
    el.classList.toggle('active', el.dataset.step == n);
  });
  document.querySelectorAll('.step-indicator').forEach(el => {
    el.classList.toggle('active', +el.dataset.step <= n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
}

document.getElementById('btn-to-step2').addEventListener('click', () => {
  if (!selectedService) return;
  renderSlots();
  showStep(2);
});

// ── Step 2: Slots ─────────────────────────────────────────────────────────────
function renderSlots() {
  const container = document.getElementById('slots-grid');
  const btn3 = document.getElementById('btn-to-step3');

  if (SLOTS.length === 0) {
    container.innerHTML = '<div class="no-slots">No slots currently available.<br>Please reach out on WhatsApp to schedule.</div>';
    btn3.style.display = 'none';
    return;
  }

  btn3.style.display = '';
  container.innerHTML = SLOTS.map((slot, i) => `
    <button
      class="slot-btn"
      data-index="${i}"
      onclick="selectSlot(${i})"
      ${!slot.available ? 'disabled' : ''}
    >
      <div class="slot-date">${slot.day}</div>
      <div class="slot-time">${slot.time}</div>
      ${!slot.available ? '<div class="slot-booked-label">Booked</div>' : ''}
    </button>
  `).join('');
}

function selectSlot(index) {
  selectedSlot = SLOTS[index];
  document.querySelectorAll('.slot-btn').forEach(el => {
    el.classList.toggle('selected', +el.dataset.index === index);
  });
  document.getElementById('btn-to-step3').disabled = false;
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
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderServices();
showStep(1);
