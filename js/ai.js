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

// ── Daily transits (updated by GitHub Actions cron at 10am IST) ───────────────

let _planetsCache = null;

async function loadPlanetsToday() {
  if (_planetsCache) return _planetsCache;
  try {
    const bust = new Date().toDateString().replace(/\s/g, '-');
    const res = await fetch(`js/planets-today.json?d=${bust}`);
    if (res.ok) _planetsCache = await res.json();
  } catch (e) {
    console.warn('[tarot] Could not load planets-today.json');
  }
  return _planetsCache;
}

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildTransitBlock(planetsData) {
  if (!planetsData) return null;
  return `TODAY'S TRANSITING PLANETS (verified positions, recorded 10:00 AM IST on ${planetsData.date}):\n${planetsData.prompt_block}`;
}

function buildNatalBlock(natal) {
  if (!natal) return null;
  const p = natal.planets;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const lines = ['sun','moon','venus','jupiter','saturn']
    .filter(b => p[b])
    .map(b => `Natal ${cap(b)}: ${p[b].sign} ${p[b].degree}`);
  return `SEEKER'S NATAL CHART (calculated from birth: ${natal.birthdate}, ${natal.birthtime}, ${natal.birthplace}):\n${lines.join('\n')}`;
}

function buildAspectBlock(aspects) {
  if (!aspects || !aspects.length) return null;
  const lines = aspects.slice(0, 6).map((a, i) => `${i + 1}. ${a.label}`);
  return `ACTIVE TRANSITS FOR THIS SEEKER TODAY (calculated, tightest orb first):\n${lines.join('\n')}`;
}

// ── Card resolver ─────────────────────────────────────────────────────────────

function resolveCard(name) {
  const key = (name || '').toLowerCase().replace(/^the /, '').trim();
  return TAROT_CARDS.find(c =>
    c.display.toLowerCase().replace(/^the /, '').trim() === key ||
    c.name.toLowerCase().includes(key)
  ) || TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
}

// ── Main reading function ─────────────────────────────────────────────────────

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

  const risingLine = userData.rising
    ? `Ascendant (confirmed by seeker): ${userData.rising} Rising`
    : `Ascendant: unknown — leave the ascendant field as ""`;

  // ── Fetch transits + natal chart in parallel ──────────────────────────────
  const [transits, natal] = await Promise.all([
    loadPlanetsToday(),
    (typeof calculateNatalChart !== 'undefined')
      ? calculateNatalChart(userData.birthdate, userData.birthtime, userData.birthplace)
      : Promise.resolve(null)
  ]);

  const aspects = (typeof calculateTransitAspects !== 'undefined')
    ? calculateTransitAspects(natal, transits)
    : [];

  const transitBlock = buildTransitBlock(transits);
  const natalBlock   = buildNatalBlock(natal);
  const aspectBlock  = buildAspectBlock(aspects);

  const hasFullData = !!(transitBlock && natalBlock && aspectBlock);

  // ── Build task section based on data availability ─────────────────────────
  let taskSection;
  if (hasFullData) {
    taskSection = `TASK:
1. The natal chart and active transits have been calculated and given above — do NOT recalculate them.
2. Focus on the 2-3 active transits most relevant to: ${focusLabel}. Consider the nature of the aspecting planets and the signs involved.
3. From this exact list, choose the ONE major arcana card that best embodies the dominant transit energy for ${focusLabel}:
${TAROT_CARD_NAMES.join(', ')}
4. Write a personal reading in Geetika's voice${userData.rising ? `, woven with their ${userData.rising} Rising nature` : ''}, grounded in the specific transits active today — speak directly to what these planetary movements mean for this seeker's ${focusLabel}. Make it felt, not academic.`;
  } else {
    taskSection = `TASK:
1. Calculate the approximate current positions of Sun, Moon, Jupiter, Venus, and Saturn for today's date.
2. Using the seeker's birth data, estimate which natal houses these transiting planets occupy.
3. Identify the single most dominant planetary energy for this seeker related to: ${focusLabel}.
4. From this exact list, choose the one major arcana card that resonates with that energy:
${TAROT_CARD_NAMES.join(', ')}
5. Write a personal reading in Geetika's voice${userData.rising ? `, woven with their ${userData.rising} Rising nature` : ''}, focused on ${focusLabel}.`;
  }

  const dataSections = [transitBlock, natalBlock, aspectBlock]
    .filter(Boolean)
    .join('\n\n');

  const userPrompt = `${dataSections ? dataSections + '\n\n' : ''}SEEKER:
Name: ${userData.name}
Date of birth: ${userData.birthdate}
Time of birth: ${userData.birthtime || 'unknown — use 12:00 noon as default'}
Place of birth: ${userData.birthplace}
${risingLine}
Today: ${today}
Reading focus: ${focusLabel}

${taskSection}

Respond with ONLY valid JSON — no markdown fences, no extra text:
{
  "ascendant": "${userData.rising ? userData.rising + ' Rising' : ''}",
  "card": "exact card name from the list above",
  "planet": "dominant transiting planet (e.g. Saturn, Venus, Moon)",
  "transit": "one sentence naming the key transit in plain, felt human language — e.g. 'Jupiter moving through Cancer is touching your natal Venus, expanding what you thought love could feel like'",
  "message": "3–4 sentences in Geetika's voice, addressed as 'you', rooted in today's specific transits and focused on ${focusLabel}",
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
        { role: 'system', content: READING_CONTEXT },
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
