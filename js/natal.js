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
