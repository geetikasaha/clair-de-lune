// tarot.jsx — card data + card-of-the-day interaction

const TAROT_CARDS = [
  { name: "The Moon", arcana: "XVIII", keywords: "intuition · illusion · dreams", message: "What the moon reveals is rarely what it shows. Trust the part of you that already knows. Walk slow tonight; the path is hidden, not gone." },
  { name: "The Star", arcana: "XVII", keywords: "hope · renewal · serenity", message: "After the storm you forgot was a storm, the sky returns. Pour your worry into the water. The light is already finding its way to you." },
  { name: "The High Priestess", arcana: "II", keywords: "mystery · inner voice · stillness", message: "The answer is not louder than the question. Be quiet enough to hear yourself. The veil thins for those who listen." },
  { name: "The Hermit", arcana: "IX", keywords: "solitude · wisdom · seeking", message: "You are not lost. You are gathering. Carry your lantern slowly — its light is meant for one step at a time." },
  { name: "The Empress", arcana: "III", keywords: "abundance · nurture · creation", message: "Tend to what is tender in you. The garden of your life does not bloom on demand — water it anyway." },
  { name: "The Lovers", arcana: "VI", keywords: "union · choice · alignment", message: "Two paths are not a problem; they are an offering. Choose the one your heart already walks toward in dreams." },
  { name: "Strength", arcana: "VIII", keywords: "courage · gentleness · grace", message: "True strength is the hand that does not strike. Soothe the wild thing in your chest; it has carried you this far." },
  { name: "The Wheel", arcana: "X", keywords: "cycles · destiny · turning", message: "Nothing remains; nothing is wasted. What rises now was once buried; what falls now will feed the next bloom." },
  { name: "The Sun", arcana: "XIX", keywords: "joy · vitality · clarity", message: "There is light enough for you, too. Stand in it without apology. You were not made for the corners of your own life." },
  { name: "The Hanged One", arcana: "XII", keywords: "surrender · perspective · pause", message: "Stop pulling. The knot loosens when you let it. Upside down, the world finally makes sense." },
  { name: "The Tower", arcana: "XVI", keywords: "rupture · truth · release", message: "What falls was never yours to keep. Stand in the rubble without shame — clearings are how forests begin again." },
  { name: "The World", arcana: "XXI", keywords: "completion · belonging · arrival", message: "You are exactly where the long road meant to bring you. Breathe. The circle closes; the next one opens." },
  { name: "Death", arcana: "XIII", keywords: "ending · rebirth · transformation", message: "Not the ending you fear — the ending you needed. Lay it down. Something tender is already pushing through the soil." },
  { name: "The Fool", arcana: "0", keywords: "beginnings · trust · leap", message: "The cliff is smaller than it looks. The world has been waiting for the version of you that begins." }
];

const CardOfTheDay = ({ intensity = 8 }) => {
  const [phase, setPhase] = React.useState('idle'); // idle | shuffling | revealed
  const [drawn, setDrawn] = React.useState(null);
  const [shuffleKey, setShuffleKey] = React.useState(0);

  const draw = () => {
    if (phase === 'shuffling') return;
    setPhase('shuffling');
    setShuffleKey(k => k + 1);
    setTimeout(() => {
      const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
      setDrawn(card);
      setPhase('revealed');
    }, 1800);
  };

  const reset = () => {
    setPhase('idle');
    setDrawn(null);
  };

  return (
    <div className="cod-wrap">
      <div className="cod-stage">
        {phase === 'idle' && (
          <div className="cod-deck" onClick={draw}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="cod-card cod-card-stack" style={{
                transform: `translate(${i * 3}px, ${-i * 2}px) rotate(${(i - 2) * 1.5}deg)`,
                zIndex: 5 - i
              }}>
                <TarotCardBack width={180} />
              </div>
            ))}
            <div className="cod-cta">click to draw</div>
          </div>
        )}
        {phase === 'shuffling' && (
          <div className="cod-shuffle" key={shuffleKey}>
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="cod-card cod-card-shuffle" style={{
                animationDelay: `${i * 0.08}s`,
                zIndex: 7 - i
              }}>
                <TarotCardBack width={180} />
              </div>
            ))}
          </div>
        )}
        {phase === 'revealed' && drawn && (
          <div className="cod-reveal">
            <div className="cod-card cod-card-revealed">
              <div className="cod-card-inner">
                <div className="cod-card-back">
                  <TarotCardBack width={220} />
                </div>
                <div className="cod-card-face">
                  <div className="cod-face-frame">
                    <div className="cod-face-arcana">{drawn.arcana}</div>
                    <div className="cod-face-illus">
                      <Moon size={120} glow={false} />
                    </div>
                    <div className="cod-face-name">{drawn.name}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cod-meaning">
              <div className="cod-keywords">{drawn.keywords}</div>
              <p className="cod-message">{drawn.message}</p>
              <button className="cod-redraw" onClick={reset}>draw another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { TAROT_CARDS, CardOfTheDay });
