// tarot.jsx — personalized pick-a-card reading, data sourced from Google Sheets

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

const GUIDANCE = [
  { key: 'general',   label: 'General',   symbol: '✦', desc: 'a broad view of now' },
  { key: 'love',      label: 'Love',      symbol: '♡', desc: 'matters of the heart' },
  { key: 'career',    label: 'Career',    symbol: '◈', desc: 'work & purpose' },
  { key: 'spiritual', label: 'Spiritual', symbol: '☽', desc: 'soul & inner life' },
];

const PickACard = () => {
  const [step, setStep]         = React.useState('intake');
  const [userName, setUserName] = React.useState('');
  const [dob, setDob]           = React.useState('');
  const [guidance, setGuidance] = React.useState(null);
  const [drawn, setDrawn]       = React.useState(null);
  const [shuffleKey, setShuffleKey] = React.useState(0);

  const firstName = userName.trim().split(' ')[0];

  const submitIntake = (e) => {
    e.preventDefault();
    if (userName.trim()) setStep('guidance');
  };

  const selectGuidance = (key) => {
    setGuidance(key);
    setStep('draw');
  };

  const draw = () => {
    if (step === 'shuffling') return;
    setStep('shuffling');
    setShuffleKey(k => k + 1);
    setTimeout(() => {
      const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
      setDrawn(card);
      setStep('revealed');
    }, 1800);
  };

  const currentGuidance = GUIDANCE.find(g => g.key === guidance);

  return (
    <div className="cod-wrap">

      {/* ── Step 1: Intake ──────────────────────────────────────────────── */}
      {step === 'intake' && (
        <div className="pac-intake">
          <div className="pac-ornament"><Ornament width={160} /></div>
          <p className="pac-prompt">before the cards speak, let them know you.</p>
          <form className="pac-form" onSubmit={submitIntake}>
            <div className="pac-field">
              <label className="pac-label">your name</label>
              <input
                className="pac-input"
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="as the moon would call you"
                required
              />
            </div>
            <div className="pac-field">
              <label className="pac-label">date of birth <span className="pac-optional">(optional)</span></label>
              <input
                className="pac-input pac-input-date"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
              />
            </div>
            <button className="pac-continue" type="submit">continue ›</button>
          </form>
        </div>
      )}

      {/* ── Step 2: Choose Guidance ─────────────────────────────────────── */}
      {step === 'guidance' && (
        <div className="pac-guidance-wrap">
          <div className="pac-ornament"><Ornament width={160} /></div>
          <p className="pac-greeting">welcome, <em>{firstName}</em>.</p>
          <p className="pac-prompt">what calls to you tonight?</p>
          <div className="pac-guidance-grid">
            {GUIDANCE.map(g => (
              <button key={g.key} className="pac-guidance-btn" onClick={() => selectGuidance(g.key)}>
                <span className="pac-guidance-symbol">{g.symbol}</span>
                <span className="pac-guidance-label">{g.label}</span>
                <span className="pac-guidance-desc">{g.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Draw ────────────────────────────────────────────────── */}
      {step === 'draw' && (
        <div className="cod-stage" style={{ flexDirection: 'column', gap: '48px' }}>
          <div className="pac-draw-prompt">
            <p className="pac-draw-hint">hold your question, <em>{firstName}</em> — then draw.</p>
            <p className="pac-draw-sub">{currentGuidance?.symbol} {currentGuidance?.label} reading · the cards are waiting</p>
          </div>
          <div className="cod-deck" onClick={draw}>
            {[0,1,2,3,4].map(i => (
              <div key={i} className="cod-card cod-card-stack" style={{
                transform: `translate(${i*3}px,${-i*2}px) rotate(${(i-2)*1.5}deg)`,
                zIndex: 5-i
              }}>
                <TarotCardBack width={180} />
              </div>
            ))}
            <div className="cod-cta">click to draw</div>
          </div>
        </div>
      )}

      {/* ── Step 3b: Shuffling ──────────────────────────────────────────── */}
      {step === 'shuffling' && (
        <div className="cod-stage">
          <div className="cod-shuffle" key={shuffleKey}>
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="cod-card cod-card-shuffle" style={{
                animationDelay: `${i*0.08}s`,
                zIndex: 7-i
              }}>
                <TarotCardBack width={180} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Revealed ────────────────────────────────────────────── */}
      {step === 'revealed' && drawn && (
        <div className="cod-stage">
          <div className="cod-reveal">
            <div className="cod-card cod-card-revealed">
              <div className="cod-card-inner">
                <div className="cod-card-back"><TarotCardBack width={220} /></div>
                <div className="cod-card-face">
                  <div className="cod-face-frame">
                    <div className="cod-face-arcana">{drawn.arcana}</div>
                    <div className="cod-face-illus">
                      <TarotCardFace cardName={drawn.name} size={110} />
                    </div>
                    <div className="cod-face-name">{drawn.display}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cod-meaning">
              <div className="pac-reading-label">
                {currentGuidance?.symbol} {currentGuidance?.label} · {drawn.definition}
              </div>
              <p className="cod-message">{drawn[guidance]}</p>
              <div className="pac-reading-for">drawn for <em>{firstName}</em>{dob && <span className="pac-dob"> · born {new Date(dob + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>}</div>
              <div className="pac-actions">
                <button className="cod-redraw" onClick={draw}>draw again</button>
                <button className="pac-guidance-change" onClick={() => setStep('guidance')}>change guidance</button>
                <button className="pac-start-over" onClick={() => { setStep('intake'); setUserName(''); setDob(''); setGuidance(null); setDrawn(null); }}>start over</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const CardOfTheDay = PickACard;

Object.assign(window, { TAROT_CARDS, PickACard, CardOfTheDay });
