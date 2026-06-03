// tarot.jsx — AI-powered astrological tarot reading (Gemini + natal chart)

const TAROT_CARDS = [
  { name: "0. The Fool",         display: "The Fool",         arcana: "0",     definition: "New Beginnings",
    general:  "Leap into the unknown; the universe catches those who fly.",
    love:     "A fresh, playful connection is beginning.",
    career:   "Start that new project without fear.",
    spiritual:"Trust your soul's internal compass." },

  { name: "I. The Magician",     display: "The Magician",     arcana: "I",     definition: "Manifestation",
    general:  "You have every tool required to create your reality.",
    love:     "Use your personal charm to bridge a gap.",
    career:   "A time of high productivity and skill.",
    spiritual:"Align your will with divine timing." },

  { name: "II. High Priestess",  display: "High Priestess",  arcana: "II",    definition: "Intuition",
    general:  "The answers reside in the silence between thoughts.",
    love:     "Listen to what is left unsaid in romance.",
    career:   "Trust your gut regarding a business deal.",
    spiritual:"Look for signs in your dreams tonight." },

  { name: "III. The Empress",    display: "The Empress",      arcana: "III",   definition: "Abundance",
    general:  "The garden of your life blooms when watered.",
    love:     "Nurture your partner and yourself equally.",
    career:   "Luxury and creative growth are incoming.",
    spiritual:"Connect with the cycles of the moon." },

  { name: "IV. The Emperor",     display: "The Emperor",      arcana: "IV",    definition: "Structure",
    general:  "Discipline is the foundation of true freedom.",
    love:     "Create healthy boundaries for lasting love.",
    career:   "Step into a leadership role with confidence.",
    spiritual:"Master your mind to master your path." },

  { name: "V. Hierophant",       display: "The Hierophant",   arcana: "V",     definition: "Tradition",
    general:  "Seek wisdom from those who walked before you.",
    love:     "Commitment and shared values are key.",
    career:   "Follow established protocols for success.",
    spiritual:"Rituals will ground your energy today." },

  { name: "VI. The Lovers",      display: "The Lovers",       arcana: "VI",    definition: "Alignment",
    general:  "Choose the path that makes your heart beat faster.",
    love:     "Harmony and deep soul-level connection.",
    career:   "Partner with someone who mirrors your values.",
    spiritual:"Your choices define your soul's vibration." },

  { name: "VII. The Chariot",    display: "The Chariot",      arcana: "VII",   definition: "Victory",
    general:  "Momentum is building; keep your hands on the reins.",
    love:     "Move forward in love with clear intent.",
    career:   "Ambition will carry you to the finish line.",
    spiritual:"Discipline leads to spiritual breakthrough." },

  { name: "VIII. Strength",      display: "Strength",         arcana: "VIII",  definition: "Courage",
    general:  "True power is found in gentleness and patience.",
    love:     "Soften your heart to resolve a conflict.",
    career:   "Persistence will win over brute force.",
    spiritual:"Tame your inner shadows with kindness." },

  { name: "IX. The Hermit",      display: "The Hermit",       arcana: "IX",    definition: "Reflection",
    general:  "The brightest light is found in your own solitude.",
    love:     "Take space to understand your own needs.",
    career:   "Step back to view your goals objectively.",
    spiritual:"Your inner light is your only true guide." },

  { name: "X. Wheel of Fortune", display: "Wheel of Fortune", arcana: "X",     definition: "Cycles",
    general:  "Change is the only constant; ride the wave.",
    love:     "Destiny is playing a hand in your status.",
    career:   "A sudden shift brings new opportunity.",
    spiritual:"Trust that the universe is recalibrating." },

  { name: "XI. Justice",         display: "Justice",          arcana: "XI",    definition: "Balance",
    general:  "Truth is the lens through which you must look.",
    love:     "Seek fairness and honesty in your bond.",
    career:   "Contracts and legalities will be resolved.",
    spiritual:"Every action has an equal soul reaction." },

  { name: "XII. Hanged Man",     display: "The Hanged Man",   arcana: "XII",   definition: "Perspective",
    general:  "Release the struggle; surrender to the now.",
    love:     "Pause and look at love from a new angle.",
    career:   "Wait for more info before moving career-wise.",
    spiritual:"Enlightenment comes through letting go." },

  { name: "XIII. Death",         display: "Death",            arcana: "XIII",  definition: "Transition",
    general:  "To bloom again, the old petals must fall.",
    love:     "Let go of a dynamic that no longer serves.",
    career:   "One door closes so a better one can open.",
    spiritual:"Rebirth follows every spiritual ending." },

  { name: "XIV. Temperance",     display: "Temperance",       arcana: "XIV",   definition: "Alchemy",
    general:  "Blend your extremes to find your middle ground.",
    love:     "Balance your emotions with your logic.",
    career:   "Patience and steady growth bring results.",
    spiritual:"Peace is found in the flow of moderation." },

  { name: "XV. The Devil",       display: "The Devil",        arcana: "XV",    definition: "Shadow",
    general:  "Recognize the chains that are actually loose.",
    love:     "Watch for patterns of obsession or ego.",
    career:   "Don't be seduced by get-rich-quick plans.",
    spiritual:"Face your attachments to find freedom." },

  { name: "XVI. The Tower",      display: "The Tower",        arcana: "XVI",   definition: "Revelation",
    general:  "What is built on a weak base must fall away.",
    love:     "A sudden realization changes everything.",
    career:   "Unexpected disruption leads to a reset.",
    spiritual:"Destruction is often a form of grace." },

  { name: "XVII. The Star",      display: "The Star",         arcana: "XVII",  definition: "Hope",
    general:  "Healing is a quiet light in the dark.",
    love:     "A period of renewal and peace in love.",
    career:   "Follow your true calling; the path is lit.",
    spiritual:"You are being guided by celestial forces." },

  { name: "XVIII. The Moon",     display: "The Moon",         arcana: "XVIII", definition: "Mystery",
    general:  "Not everything is as it appears; trust your gut.",
    love:     "Emotions may be clouded by old fears.",
    career:   "Hidden information will soon come to light.",
    spiritual:"Navigate the subconscious with courage." },

  { name: "XIX. The Sun",        display: "The Sun",          arcana: "XIX",   definition: "Vitality",
    general:  "Success is inevitable; bask in the warmth.",
    love:     "Joy, celebration, and radiant affection.",
    career:   "You are entering a peak of recognition.",
    spiritual:"Your spirit is shining at its brightest." },

  { name: "XX. Judgement",       display: "Judgement",        arcana: "XX",    definition: "Awakening",
    general:  "Answer the call; your past is now behind you.",
    love:     "A time for forgiveness and a new chapter.",
    career:   "Evaluate your life's work with honesty.",
    spiritual:"You are rising to a higher level of being." },

  { name: "XXI. The World",      display: "The World",        arcana: "XXI",   definition: "Completion",
    general:  "The circle is whole; you have arrived.",
    love:     "Fulfillment and unity in your connections.",
    career:   "Achievement of a long-term professional goal.",
    spiritual:"You are at one with the cosmic rhythm." },
];

const PAC_STORAGE_KEY = 'cdl_tarot_reading';

// ── Loading dots animation ────────────────────────────────────────────────────
const LoadingDots = () => (
  <div className="pac-loading-dots">
    <span /><span /><span />
  </div>
);

// ── Card display (face + meaning) ─────────────────────────────────────────────
const CardReveal = ({ reading, firstName, showBooking, animate }) => {
  const card = reading.cardObj;
  if (!card) return null;
  return (
    <div className="cod-reveal">

      {/* ── Row 1: card + reading text side by side ── */}
      <div className="cod-reveal-main">
        <div className="cod-card cod-card-revealed">
          <div className="cod-card-inner" style={animate ? {} : { animation: 'none', transform: 'rotateY(180deg)' }}>
            <div className="cod-card-back"><TarotCardBack width={220} /></div>
            <div className="cod-card-face">
              <div className="cod-face-frame">
                <div className="cod-face-arcana">{card.arcana}</div>
                <div className="cod-face-illus"><TarotCardFace cardName={card.name} size={110} /></div>
                <div className="cod-face-name">{card.display}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cod-meaning">
          {reading.ascendant && (
            <div className="pac-ascendant-line">☽ {reading.ascendant}</div>
          )}
          <div className="pac-reading-label">
            {reading.planet && <span>✦ {reading.planet} · </span>}{card.definition}
            {reading.readingType && <span className="pac-focus-tag"> · {reading.readingType}</span>}
          </div>
          {reading.transit && <p className="pac-transit-line">{reading.transit}</p>}
          <p className="cod-message">{reading.message}</p>
          {reading.guidance && <p className="pac-guidance-line"><em>{reading.guidance}</em></p>}
          <div className="pac-reading-for">drawn for <em>{(firstName || '').toLowerCase()}</em></div>
        </div>
      </div>

      {/* ── Row 2: CTA full width ── */}
      <div className="pac-cta-block">
        <div className="pac-cta-accent" />
        <p className="pac-cta-prompt">
          your card has shown you the energy. a full reading with geetika will show you <em>what to do with it</em> — the blocks, the path, and what your soul is truly asking for.
        </p>
        <div className="pac-cta-actions">
          <a href="book.html" className="pac-cta-btn">
            book a reading with geetika →
          </a>
          <p className="pac-cta-note">
            {showBooking
              ? 'each seeker draws once — your card was chosen by the stars for you.'
              : 'one-on-one · tarot · astrology · spiritual guidance · via whatsapp'}
          </p>
        </div>
      </div>

    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const PickACard = () => {
  const [step, setStep]   = React.useState('init');
  const [reading, setReading] = React.useState(null);
  const [form, setForm]   = React.useState({
    name: '', birthdate: '', birthtime: '', birthplace: '', noTime: false, readingType: '', rising: ''
  });
  const revealRef = React.useRef(null);

  React.useEffect(() => {
    if (step === 'revealed' && revealRef.current) {
      setTimeout(() => {
        revealRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [step]);

  React.useEffect(() => {
    const saved = localStorage.getItem(PAC_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Re-resolve cardObj from TAROT_CARDS (can't store React-ready objects)
        if (parsed.card) {
          const key = parsed.card.toLowerCase().replace(/^the /, '').trim();
          parsed.cardObj = TAROT_CARDS.find(c =>
            c.display.toLowerCase().replace(/^the /, '').trim() === key ||
            c.name.toLowerCase().includes(key)
          ) || TAROT_CARDS[0];
        }
        setReading(parsed);
        setStep('already_pulled');
        return;
      } catch { /* fall through to intake */ }
    }
    setStep('intake');
  }, []);

  const firstName = (form.name || reading?.name || '').trim().split(' ')[0];

  const submitIntake = async (e) => {
    e.preventDefault();
    setStep('loading');

    try {
      const result = await getGeminiReading({
        name: form.name,
        birthdate: form.birthdate,
        birthtime: form.noTime ? '' : form.birthtime,
        birthplace: form.birthplace,
        readingType: form.readingType,
        rising: form.rising
      });
      const toStore = { ...result, name: form.name, readingType: form.readingType, pulledAt: Date.now() };
      // Store card name string only (cardObj is not JSON-serialisable safely)
      const { cardObj, ...storeable } = toStore;
      localStorage.setItem(PAC_STORAGE_KEY, JSON.stringify(storeable));
      setReading(toStore);
      setStep('revealed');
    } catch (err) {
      console.error('[tarot] Gemini failed:', err);
      // Fallback: random card with default message
      const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
      const fallback = {
        cardObj: card,
        card: card.display,
        planet: 'the cosmos',
        transit: 'the stars are moving in quiet ways today.',
        message: card.general,
        guidance: 'sit with this — the answer is already within you.',
        name: form.name,
        pulledAt: Date.now()
      };
      const { cardObj: _c, ...storeable } = fallback;
      localStorage.setItem(PAC_STORAGE_KEY, JSON.stringify(storeable));
      setReading(fallback);
      setStep('revealed');
    }
  };

  const startFresh = () => {
    localStorage.removeItem(PAC_STORAGE_KEY);
    setReading(null);
    setForm({ name: '', birthdate: '', birthtime: '', birthplace: '', noTime: false, readingType: '', rising: '' });
    setStep('intake');
  };

  if (step === 'init') return null;

  return (
    <div className="cod-wrap">

      {/* ── Already pulled ──────────────────────────────────────────────── */}
      {step === 'already_pulled' && reading && (
        <div className="cod-stage">
          <CardReveal reading={reading} firstName={reading.name?.split(' ')[0]} showBooking animate={false} />
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button className="pac-start-over" onClick={startFresh}>I am someone new</button>
          </div>
        </div>
      )}

      {/* ── Intake form ─────────────────────────────────────────────────── */}
      {step === 'intake' && (
        <div className="pac-intake">
          <div className="pac-ornament"><Ornament width={160} /></div>
          <p className="pac-prompt">the stars need to know you first.</p>
          <form className="pac-form" onSubmit={submitIntake}>
            <div className="pac-field">
              <label className="pac-label">your name</label>
              <input className="pac-input" type="text" required placeholder="as the moon would call you"
                value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div className="pac-field">
              <label className="pac-label">date of birth</label>
              <input className="pac-input pac-input-date" type="date" required
                value={form.birthdate} onChange={e => setForm(f => ({...f, birthdate: e.target.value}))} />
            </div>
            <div className="pac-field">
              <label className="pac-label">
                time of birth <span className="pac-optional">(as close as you know)</span>
              </label>
              <input className="pac-input" type="time" disabled={form.noTime}
                value={form.birthtime} onChange={e => setForm(f => ({...f, birthtime: e.target.value}))} />
              <label className="pac-check-label">
                <input type="checkbox" checked={form.noTime}
                  onChange={e => setForm(f => ({...f, noTime: e.target.checked, birthtime: ''}))} />
                <span>I don't know my birth time</span>
              </label>
            </div>
            <div className="pac-field">
              <label className="pac-label">place of birth</label>
              <input className="pac-input" type="text" required placeholder="city, country"
                value={form.birthplace} onChange={e => setForm(f => ({...f, birthplace: e.target.value}))} />
            </div>
            <div className="pac-field">
              <label className="pac-label">
                your rising sign <span className="pac-optional">(if you know it)</span>
              </label>
              <select className="pac-input pac-select" value={form.rising}
                onChange={e => setForm(f => ({...f, rising: e.target.value}))}>
                <option value="">I don't know</option>
                {['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="pac-field">
              <label className="pac-label">what calls to you most right now?</label>
              <div className="pac-focus-grid">
                {[
                  { id: 'love',    symbol: '♀', label: 'love' },
                  { id: 'career',  symbol: '☽', label: 'career' },
                  { id: 'self',    symbol: '✦', label: 'self' },
                  { id: 'general', symbol: '◎', label: 'general' },
                ].map(opt => (
                  <button key={opt.id} type="button"
                    className={`pac-focus-btn${form.readingType === opt.id ? ' pac-focus-active' : ''}`}
                    onClick={() => setForm(f => ({...f, readingType: opt.id}))}>
                    <span className="pac-focus-symbol">{opt.symbol}</span>
                    <span className="pac-focus-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="pac-continue" type="submit" disabled={!form.readingType}
              style={!form.readingType ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
              read my stars ›
            </button>
          </form>
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────────── */}
      {step === 'loading' && (
        <div className="pac-loading">
          <div className="pac-loading-moon">☽</div>
          <p className="pac-loading-text">reading the sky for <em>{firstName}</em>…</p>
          <p className="pac-loading-sub">tracing where Saturn sits, what Venus is asking of you</p>
          <LoadingDots />
        </div>
      )}

      {/* ── Revealed ────────────────────────────────────────────────────── */}
      {step === 'revealed' && reading && (
        <div className="cod-stage" ref={revealRef}>
          <CardReveal reading={reading} firstName={firstName} showBooking={false} animate />
        </div>
      )}

    </div>
  );
};

const CardOfTheDay = PickACard;
Object.assign(window, { TAROT_CARDS, PickACard, CardOfTheDay });
