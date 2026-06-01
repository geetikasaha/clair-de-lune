// ── AI Tarot Reading — powered by Groq (free tier) ───────────────────────────
// Get a free API key at: console.groq.com → API Keys
// Add it as a GitHub secret named GROQ_API_KEY

const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';

const TAROT_CARD_NAMES = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
  'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
  'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
  'The Hanged Man', 'Death', 'Temperance', 'The Devil',
  'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
];

function resolveCard(name) {
  const key = (name || '').toLowerCase().replace(/^the /, '').trim();
  return TAROT_CARDS.find(c =>
    c.display.toLowerCase().replace(/^the /, '').trim() === key ||
    c.name.toLowerCase().includes(key)
  ) || TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
}

async function getGeminiReading(userData) {
  if (!GROQ_API_KEY || GROQ_API_KEY.startsWith('YOUR_')) {
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

  const systemPrompt = READING_CONTEXT;

  const risingLine = userData.rising
    ? `Ascendant (confirmed by seeker): ${userData.rising} Rising`
    : `Ascendant: unknown — do not guess or calculate it, leave the ascendant field as empty string ""`;

  const userPrompt = `SEEKER:
Name: ${userData.name}
Date of birth: ${userData.birthdate}
Time of birth: ${userData.birthtime || 'unknown — use 12:00 noon as default'}
Place of birth: ${userData.birthplace}
${risingLine}
Today: ${today}
Reading focus: ${focusLabel}

TASK:
1. Calculate the approximate current positions of Sun, Moon, Jupiter, Venus, and Saturn for today's date.
2. Using the seeker's birth data${userData.rising ? ` and their confirmed ${userData.rising} Rising` : ''}, estimate which natal houses these transiting planets currently occupy. Note especially planets transiting the 1st, 7th, or 10th house.
3. Identify the single most dominant planetary energy for this seeker right now, specifically as it relates to: ${focusLabel}.
4. From this exact list, choose the one major arcana card that most resonates with that energy AND their focus area:
${TAROT_CARD_NAMES.join(', ')}
5. Write a personal reading in Geetika's voice${userData.rising ? `, woven with their ${userData.rising} Rising nature` : ''}, focused entirely on ${focusLabel}.

Respond with ONLY valid JSON — no markdown fences, no extra text:
{
  "ascendant": "${userData.rising ? userData.rising + ' Rising' : ''}",
  "card": "exact card name from the list above",
  "planet": "dominant planet (e.g. Saturn, Venus, Moon)",
  "transit": "one sentence about the key transit in plain, felt human language",
  "message": "3–4 sentences in Geetika's voice, addressed as 'you', focused on ${focusLabel}",
  "guidance": "one closing line — a gentle invitation, not a prediction"
}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt }
      ],
      temperature: 0.75,
      max_tokens: 900,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`groq-${res.status}: ${errText}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  parsed.cardObj = resolveCard(parsed.card);
  return parsed;
}
