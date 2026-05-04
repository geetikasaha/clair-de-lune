// ── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'spiritual',
    name: 'Spiritual Guidance',
    description: 'A holistic 30-minute session connecting your energy, life path, and highest soul-purpose.',
    duration: '30 min',
    price: 1000
  },
  {
    id: 'one-q',
    name: '1 Question Tarot',
    description: 'One focused question, one clear answer. Precise energetic insight for your most pressing concern.',
    duration: '~15 min',
    price: 200
  },
  {
    id: 'three-q',
    name: '3 Question Tarot',
    description: 'Three questions, three illuminated paths. Ideal for layered situations needing clarity.',
    duration: '~20 min',
    price: 600
  },
  {
    id: 'full',
    name: 'Full Reading',
    description: 'A comprehensive 30-card spread covering all dimensions of your current energetic reality.',
    duration: '30 min',
    price: 1000
  }
];

// ── YOUR AVAILABLE SLOTS ──────────────────────────────────────────────────────
// Schedule:
//   Mon–Fri  → 10:00 PM – 11:00 PM
//   Sat–Sun  → 9:00 AM – 12:00 PM  &  3:00 PM – 5:00 PM
//
// Set available: false to mark a slot as booked (greyed out).
// Remove a slot entirely to hide it completely.
const SLOTS = [
  // ── Week 1 ──────────────────────────────────────────────────────────────
  { date: '2026-05-04', day: 'Sun, 4 May',  time: '3:00 PM',  available: true },
  { date: '2026-05-04', day: 'Sun, 4 May',  time: '4:00 PM',  available: true },

  { date: '2026-05-05', day: 'Mon, 5 May',  time: '10:00 PM', available: true },

  { date: '2026-05-06', day: 'Tue, 6 May',  time: '10:00 PM', available: true },

  { date: '2026-05-07', day: 'Wed, 7 May',  time: '10:00 PM', available: true },

  { date: '2026-05-08', day: 'Thu, 8 May',  time: '10:00 PM', available: true },

  { date: '2026-05-09', day: 'Fri, 9 May',  time: '10:00 PM', available: true },

  { date: '2026-05-10', day: 'Sat, 10 May', time: '9:00 AM',  available: true },
  { date: '2026-05-10', day: 'Sat, 10 May', time: '10:00 AM', available: true },
  { date: '2026-05-10', day: 'Sat, 10 May', time: '11:00 AM', available: true },
  { date: '2026-05-10', day: 'Sat, 10 May', time: '3:00 PM',  available: true },
  { date: '2026-05-10', day: 'Sat, 10 May', time: '4:00 PM',  available: true },

  { date: '2026-05-11', day: 'Sun, 11 May', time: '9:00 AM',  available: true },
  { date: '2026-05-11', day: 'Sun, 11 May', time: '10:00 AM', available: true },
  { date: '2026-05-11', day: 'Sun, 11 May', time: '11:00 AM', available: true },
  { date: '2026-05-11', day: 'Sun, 11 May', time: '3:00 PM',  available: true },
  { date: '2026-05-11', day: 'Sun, 11 May', time: '4:00 PM',  available: true },

  // ── Week 2 ──────────────────────────────────────────────────────────────
  { date: '2026-05-12', day: 'Mon, 12 May', time: '10:00 PM', available: true },

  { date: '2026-05-13', day: 'Tue, 13 May', time: '10:00 PM', available: true },

  { date: '2026-05-14', day: 'Wed, 14 May', time: '10:00 PM', available: true },

  { date: '2026-05-15', day: 'Thu, 15 May', time: '10:00 PM', available: true },

  { date: '2026-05-16', day: 'Fri, 16 May', time: '10:00 PM', available: true },

  { date: '2026-05-17', day: 'Sat, 17 May', time: '9:00 AM',  available: true },
  { date: '2026-05-17', day: 'Sat, 17 May', time: '10:00 AM', available: true },
  { date: '2026-05-17', day: 'Sat, 17 May', time: '11:00 AM', available: true },
  { date: '2026-05-17', day: 'Sat, 17 May', time: '3:00 PM',  available: true },
  { date: '2026-05-17', day: 'Sat, 17 May', time: '4:00 PM',  available: true },

  { date: '2026-05-18', day: 'Sun, 18 May', time: '9:00 AM',  available: true },
  { date: '2026-05-18', day: 'Sun, 18 May', time: '10:00 AM', available: true },
  { date: '2026-05-18', day: 'Sun, 18 May', time: '11:00 AM', available: true },
  { date: '2026-05-18', day: 'Sun, 18 May', time: '3:00 PM',  available: true },
  { date: '2026-05-18', day: 'Sun, 18 May', time: '4:00 PM',  available: true },
];
// ─────────────────────────────────────────────────────────────────────────────
