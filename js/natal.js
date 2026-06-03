// js/natal.js — natal chart calculator + transit aspect engine
// Requires astronomy-engine to be loaded first (CDN script tag in HTML).
// Astronomy Engine by Don Cross: https://github.com/cosinekitty/astronomy

const NATAL_SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

function lonToSignObj(lon) {
  const l = ((lon % 360) + 360) % 360;
  const idx = Math.floor(l / 30);
  const inS = l % 30;
  const d = Math.floor(inS);
  const m = Math.floor((inS - d) * 60);
  return {
    sign: NATAL_SIGNS[idx],
    degree: `${d}°${String(m).padStart(2, '0')}'`,
    longitude: Math.round(l * 100) / 100
  };
}

// Precession correction: J2000 ecliptic longitude → tropical ecliptic longitude
function precessionDeg(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000
  return (5029.097 * T + 1.558 * T * T) / 3600.0;
}

function getTropicalLon(bodyName, date) {
  if (bodyName === 'Sun') {
    // SunPosition already returns tropical ecliptic longitude
    return Astronomy.SunPosition(date).elon;
  }
  // GeoVector returns J2000 ICRF coords → Ecliptic gives J2000 ecliptic lon
  // Add precession to get tropical lon (< 0.5° correction for dates near J2000)
  const geo = Astronomy.GeoVector(bodyName, date, bodyName !== 'Moon');
  const ecl = Astronomy.Ecliptic(geo);
  return ecl.elon + precessionDeg(date);
}

// birthdate: "YYYY-MM-DD", birthtime: "HH:MM" or "" (defaults to noon)
// birthplace: string — used only for display, not coords (geocentric calc is sufficient)
async function calculateNatalChart(birthdate, birthtime, birthplace) {
  if (typeof Astronomy === 'undefined') {
    console.warn('[natal] Astronomy Engine not loaded — skipping natal calc');
    return null;
  }
  try {
    // Treat input as local time (correct for Indian users whose browser is IST)
    const dt = new Date(birthtime
      ? `${birthdate}T${birthtime}:00`
      : `${birthdate}T12:00:00`
    );
    const planets = {};
    for (const b of ['Sun', 'Moon', 'Venus', 'Jupiter', 'Saturn']) {
      planets[b.toLowerCase()] = lonToSignObj(getTropicalLon(b, dt));
    }
    return { birthdate, birthtime: birthtime || '12:00', birthplace, planets };
  } catch (e) {
    console.warn('[natal] Chart calculation failed:', e.message);
    return null;
  }
}

// Compare natal chart against today's transits and return active aspects
// transits: planets-today.json data (requires .longitude field on each planet)
function calculateTransitAspects(natal, transits) {
  if (!natal || !transits) return [];

  const ASPECTS = [
    { name: 'conjunction', angle: 0,   orb: 8 },
    { name: 'opposition',  angle: 180, orb: 8 },
    { name: 'trine',       angle: 120, orb: 6 },
    { name: 'square',      angle: 90,  orb: 6 },
    { name: 'sextile',     angle: 60,  orb: 4 },
  ];

  const bodies = ['sun', 'moon', 'venus', 'jupiter', 'saturn'];
  const aspects = [];

  for (const tb of bodies) {
    for (const nb of bodies) {
      const tLon = transits.planets[tb]?.longitude;
      const nLon = natal.planets[nb]?.longitude;
      if (tLon == null || nLon == null) continue;

      let diff = Math.abs(tLon - nLon) % 360;
      if (diff > 180) diff = 360 - diff;

      for (const { name, angle, orb } of ASPECTS) {
        const exactOrb = Math.abs(diff - angle);
        if (exactOrb <= orb) {
          const tc = tb[0].toUpperCase() + tb.slice(1);
          const nc = nb[0].toUpperCase() + nb.slice(1);
          aspects.push({
            transit: tb, natal: nb, aspect: name,
            orb: Math.round(exactOrb * 10) / 10,
            label: `Transiting ${tc} (${transits.planets[tb].sign} ${transits.planets[tb].degree}) ${name} Natal ${nc} (${natal.planets[nb].sign} ${natal.planets[nb].degree}) — orb ${Math.round(exactOrb * 10) / 10}°`
          });
          break; // one aspect per pair
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb); // tightest orb first
}

// ── Whole Sign House Analysis ─────────────────────────────────────────────────
// Whole Sign: 1st house = entire rising sign, 2nd = next sign, etc.
// If rising is unknown, falls back to Solar houses (1st house = Sun sign).

const SIGN_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
};

const HOUSE_THEMES = {
  1:  'Self, identity, physical body, how you appear and begin things',
  2:  'Personal wealth, income, material resources, self-worth',
  3:  'Communication, siblings, short journeys, immediate environment',
  4:  'Home, roots, family, emotional foundation, inner life',
  5:  'Romance, dating, creative self-expression, pleasure, children',
  6:  'Daily work, health, service, colleagues, skills and routine',
  7:  'Marriage, committed partnership, open relationships, contracts',
  8:  'Shared resources, transformation, depth, sexuality, inheritance',
  9:  'Higher learning, philosophy, long journeys, beliefs, spirituality',
  10: 'Career, public reputation, life achievement, authority figures',
  11: 'Friendships, community, hopes, social networks, ideals',
  12: 'Hidden self, solitude, spiritual retreat, past karma, what you release'
};

// Houses to show for each reading focus
const FOCUS_HOUSES = {
  love:    { houses: [5, 7],     label: 'love & relationships (5th — romance, 7th — partnership)' },
  career:  { houses: [2, 6, 10], label: 'wealth & career (2nd — income, 6th — daily work, 10th — career peak)' },
  self:    { houses: [1, 9, 12], label: 'self & spirit (1st — identity, 9th — beliefs, 12th — hidden self)' },
  general: { houses: [1, 4, 7, 10], label: 'general life themes (angular houses: 1st, 4th, 7th, 10th)' }
};

function calculateHouses(rising, natalPlanets, readingFocus) {
  if (!natalPlanets) return null;

  // Determine anchor sign: use rising if known, else fall back to natal Sun sign
  const anchorSign = rising || natalPlanets.sun?.sign;
  const isSolar = !rising;
  if (!anchorSign) return null;

  const anchorIdx = NATAL_SIGNS.indexOf(anchorSign);
  if (anchorIdx === -1) return null;

  const focus = FOCUS_HOUSES[readingFocus] || FOCUS_HOUSES.general;
  const cap = s => s[0].toUpperCase() + s.slice(1);

  const houses = focus.houses.map(num => {
    const houseSignIdx = (anchorIdx + num - 1) % 12;
    const houseSign = NATAL_SIGNS[houseSignIdx];

    // Which natal planets fall in this house (= this sign, whole sign)?
    const planetsHere = Object.entries(natalPlanets)
      .filter(([, pos]) => pos.sign === houseSign)
      .map(([planet, pos]) => `${cap(planet)} (${pos.degree})`);

    // Where is the house ruler placed natally?
    const ruler = SIGN_RULERS[houseSign];
    const rulerPlanetKey = ruler.toLowerCase();
    const rulerNatalPos = natalPlanets[rulerPlanetKey];
    const rulerPlacement = rulerNatalPos
      ? `${rulerNatalPos.sign} ${rulerNatalPos.degree} (${houseNumOf(rulerNatalPos.sign, anchorIdx)})`
      : 'not tracked';

    return {
      house: num,
      sign: houseSign,
      theme: HOUSE_THEMES[num],
      ruler,
      rulerPlacement,
      planetsInHouse: planetsHere
    };
  });

  return { anchor: anchorSign, isSolar, focusLabel: focus.label, houses };
}

// Helper: which house number does a sign fall in, given the anchor sign index?
function houseNumOf(sign, anchorIdx) {
  const signIdx = NATAL_SIGNS.indexOf(sign);
  const houseNum = ((signIdx - anchorIdx + 12) % 12) + 1;
  return `${houseNum}${['','st','nd','rd'][houseNum] || 'th'} house`;
}

// ── Transit House Positions ───────────────────────────────────────────────────
// Shows WHERE today's transiting planets are currently sitting in the natal
// house system. This closes the loop: natal ruler + transit house + aspect.

function getTransitHousePositions(rising, natalSunSign, transits) {
  if (!transits) return null;

  const anchorSign = rising || natalSunSign;
  if (!anchorSign) return null;

  const anchorIdx = NATAL_SIGNS.indexOf(anchorSign);
  if (anchorIdx === -1) return null;

  const isSolar = !rising;
  const cap = s => s[0].toUpperCase() + s.slice(1);

  const lines = ['sun', 'moon', 'venus', 'jupiter', 'saturn']
    .filter(b => transits.planets[b])
    .map(b => {
      const p = transits.planets[b];
      const houseNum = ((NATAL_SIGNS.indexOf(p.sign) - anchorIdx + 12) % 12) + 1;
      const ordinal = `${houseNum}${['','st','nd','rd'][houseNum] || 'th'}`;
      const theme = HOUSE_THEMES[houseNum] || '';
      return `${cap(b)} (${p.sign} ${p.degree}) → currently transiting your ${ordinal} house (${theme})`;
    });

  const label = isSolar
    ? `Solar houses (${anchorSign} as 1st)`
    : `${anchorSign} Rising`;

  return {
    label,
    lines,
    formatted: `TRANSITING PLANETS IN NATAL HOUSES TODAY (${label}):\n${lines.join('\n')}`
  };
}
