// ── Gemini API — Astrological Tarot Reading ──────────────────────────────────
// Get a free API key at: aistudio.google.com
// Paste it below, then push to GitHub.

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

const GEMINI_CARD_NAMES = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
  'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
  'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
  'The Hanged Man', 'Death', 'Temperance', 'The Devil',
  'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
];

// Matches Gemini's card name back to the TAROT_CARDS array (defined in tarot.jsx)
function resolveCard(geminiName) {
  const key = (geminiName || '').toLowerCase().replace(/^the /, '').trim();
  return TAROT_CARDS.find(c =>
    c.display.toLowerCase().replace(/^the /, '').trim() === key ||
    c.name.toLowerCase().includes(key)
  ) || TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
}

async function getGeminiReading(userData) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.startsWith('YOUR_')) {
    throw new Error('no-key');
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const focusLabel = {
    love:    'love & relationships',
    career:  'career & purpose',
    self:    'inner self & spirit',
    general: 'general life guidance'
  }[userData.readingType] || 'general life guidance';

  const prompt = `${READING_CONTEXT}

---

SEEKER:
Name: ${userData.name}
Date of birth: ${userData.birthdate}
Time of birth: ${userData.birthtime || 'unknown — use 12:00 noon as default'}
Place of birth: ${userData.birthplace}
Today: ${today}
Reading focus: ${focusLabel}

TASK:
1. Using the seeker's birth date, time, and place, calculate their approximate Ascendant (Rising sign). Show your reasoning briefly — use the latitude of the birth city, the Local Sidereal Time, and the approximate degree of the ecliptic rising. State the Ascendant sign clearly.
2. Calculate the approximate current positions of Sun, Moon, Jupiter, Venus, and Saturn based on today's date.
3. Using the seeker's birth data and Ascendant, estimate which natal houses these transiting planets currently occupy. Note especially any planets transiting the 1st house (conjunct Ascendant), 7th (relationships), 10th (career), or any angular houses.
4. Identify the single most dominant planetary energy for this seeker right now — one that is most activated by both their natal chart and current transits — specifically as it relates to their focus: ${focusLabel}.
5. From this exact list, choose the one major arcana card that most resonates with that dominant energy AND their focus area:
${GEMINI_CARD_NAMES.join(', ')}
6. Write a personal reading in Geetika's voice, woven through with the seeker's Ascendant energy and current transits, focused entirely on ${focusLabel}.

Respond with ONLY valid JSON — no markdown fences, no text before or after:
{
  "ascendant": "the rising sign (e.g. Scorpio Rising, Leo Rising)",
  "card": "exact card name from the list above",
  "planet": "dominant planet (e.g. Saturn, Venus, Moon)",
  "transit": "one sentence naming the key transit and how it is touching the seeker's chart right now, in plain felt human language",
  "message": "3–4 sentences of personal reading in Geetika's voice, addressed as 'you', woven with the ascendant and current planetary energy, focused on ${focusLabel}",
  "guidance": "one closing line — a gentle invitation or direction for ${focusLabel}, not a prediction"
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 900 }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`gemini-${res.status}: ${errText}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  parsed.cardObj = resolveCard(parsed.card);
  return parsed;
}
