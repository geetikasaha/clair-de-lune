// sections.jsx — adapted for Clair de Lune production site

const SectionLabel = ({ children, num }) => (
  <div className="sec-label">
    <span className="sec-num">{num}</span>
    <span className="sec-line" />
    <span className="sec-text">{children}</span>
  </div>
);

// ── About ──────────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" className="section section-about" data-screen-label="03 About">
    <div className="section-inner about-grid">
      <div className="about-portrait">
        <div className="portrait-frame">
          <div className="portrait-arch">
            <Stag width={260} color="#040a07" />
          </div>
          <div className="portrait-mist" />
          <div className="portrait-caption">— the keeper of the grove —</div>
        </div>
      </div>
      <div className="about-text">
        <SectionLabel num="01">whispered beginnings</SectionLabel>
        <h2 className="display-h">A small light, kept burning for the wandering.</h2>
        <p className="body-l">
          Clair de Lune began as a candle in a window — a place for those at the lowest hour and those climbing back toward themselves. I read with the moon, the cards, and a quiet ear. There is no fortune to tell here, only a mirror, gently held.
        </p>
        <p className="body-l" style={{ marginTop: '1.4rem' }}>
          I believe the cards do not foretell — they remember. They speak the parts of you that the daytime cannot afford to. If you have arrived at this page, something already knew the way.
        </p>
        <div className="about-sigs">
          <div className="sig">
            <div className="sig-num">II</div>
            <div className="sig-label">years reading</div>
            <div className="sig-val">nine winters</div>
          </div>
          <div className="sig">
            <div className="sig-num">III</div>
            <div className="sig-label">deck of choice</div>
            <div className="sig-val">smith-waite, hand-worn</div>
          </div>
          <div className="sig">
            <div className="sig-num">IV</div>
            <div className="sig-label">read by</div>
            <div className="sig-val">candle &amp; new moon</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Services / Readings ───────────────────────────────────────────────────
const REAL_SERVICES = [
  {
    id: "spiritual",
    name: "Spiritual Guidance",
    sub: "a holistic session",
    duration: "30 min",
    price: "₹1,000",
    glyph: "✦",
    desc: "You already sense what's true — this session helps you hear it clearly. Sit with your energy, your life, and what your soul is asking for. Not advice. Not a roadmap. Just you, finally listening."
  },
  {
    id: "one-q",
    name: "1 Question Tarot",
    sub: "a single truth",
    duration: "~15 min",
    price: "₹200",
    glyph: "◦",
    desc: "One thing is burning in you right now. The cards don't predict — they reveal what you already sense is true but haven't let yourself say out loud."
  },
  {
    id: "three-q",
    name: "3 Question Tarot",
    sub: "layered clarity",
    duration: "~20 min",
    price: "₹600",
    glyph: "⋆",
    featured: true,
    desc: "Three areas of your life asking to be seen. Bring them all. Leave with clarity that was always inside you, just buried under noise and fear."
  },
  {
    id: "full",
    name: "Full Reading",
    sub: "30-card spread",
    duration: "30 min",
    price: "₹1,000",
    glyph: "☽",
    desc: "A complete landscape of your energy — what's moving, what's blocked, what's already in motion. For the moments when you know something big is shifting. Be ready to go deep."
  }
];

const Services = () => (
  <section id="readings" className="section section-readings" data-screen-label="04 Readings">
    <div className="section-inner">
      <SectionLabel num="02">offerings</SectionLabel>
      <h2 className="display-h center">Four lanterns. Choose the one that flickers.</h2>
      <div className="readings-grid readings-grid-4">
        {REAL_SERVICES.map((r, i) => (
          <div key={i} className={"reading-card" + (r.featured ? " featured" : "")}>
            <div className="reading-glyph">{r.glyph}</div>
            <div className="reading-sub">{r.sub}</div>
            <h3 className="reading-name">{r.name}</h3>
            <Ornament width={120} />
            <p className="reading-desc">{r.desc}</p>
            <div className="reading-meta">
              <div><span className="meta-k">time</span><span className="meta-v">{r.duration}</span></div>
              <div><span className="meta-k">offering</span><span className="meta-v">{r.price}</span></div>
            </div>
            <a href={`book.html?service=${r.id}`} className="reading-cta">book this sitting →</a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Book CTA ───────────────────────────────────────────────────────────────
const BookCTA = () => (
  <section id="book" className="section section-book" data-screen-label="05 Book">
    <div className="section-inner">
      <SectionLabel num="03">arrange a sitting</SectionLabel>
      <h2 className="display-h center">Ready to go deeper?</h2>

      <div className="book-cta-why">
        <p className="book-cta-lead">
          People come here when something feels stuck. When a decision won't settle.
          When they <em>know</em> something is shifting — but can't name it yet.
        </p>
        <div className="book-cta-outcomes">
          {[
            { icon: '◎', text: 'understand why you keep circling the same patterns' },
            { icon: '◎', text: 'see where your energy is blocked — and what is moving' },
            { icon: '◎', text: 'hear yourself clearly, without the noise' },
            { icon: '◎', text: 'know what your soul is actually asking for right now' },
          ].map((item, i) => (
            <div key={i} className="book-cta-outcome-item">
              <span className="book-cta-outcome-icon">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="book-cta-action">
        <a href="book.html" className="btn-primary btn-large">book a reading with geetika →</a>
        <a href="https://wa.me/917999634730?text=Hi%20Geetika!%20I'd%20like%20to%20know%20more%20about%20a%20reading." target="_blank" className="btn-ghost">not sure? ask on whatsapp</a>
        <div className="book-cta-trust">
          {['one-on-one · online', 'confirmed via whatsapp', 'pay after confirmation'].map((note, i) => (
            <span key={i} className="book-cta-trust-note">{note}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Footer ─────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="footer" data-screen-label="07 Footer">
    <div className="section-inner">
      <div className="footer-grid">
        <div>
          <div className="wordmark-sm">Clair de Lune</div>
          <p className="footer-tag">a candle in the window for the wandering.</p>
        </div>
        <div className="footer-cols">
          <div>
            <div className="footer-h">the grove</div>
            <a href="about.html">about</a>
            <a href="services.html">offerings</a>
            <a href="book.html">book a sitting</a>
          </div>
          <div>
            <div className="footer-h">reach out</div>
            <a href="https://wa.me/917999634730" target="_blank">whatsapp</a>
            <a href="https://wa.me/917999634730?text=I%20have%20a%20question" target="_blank">ask a question</a>
          </div>
          <div>
            <div className="footer-h">a quiet word</div>
            <p className="footer-note">readings are not a replacement for medical, legal, or therapeutic guidance — only a companion alongside.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 clair de lune · geetika saha</span>
        <span>✶ ☽ ✦</span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { About, Services, BookCTA, Footer, SectionLabel, REAL_SERVICES });
