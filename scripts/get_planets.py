#!/usr/bin/env python3
"""
Calculate today's tropical planetary positions and write to js/planets-today.json.
Runs via GitHub Actions daily at 10:00 AM IST (04:30 UTC).

Uses pyephem for accurate astronomical calculations.
Tropical zodiac (Western astrology) — epoch = current date.
"""
import ephem
import math
import json
import os
from datetime import datetime, timezone, timedelta

SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

SIGN_ENERGY = {
    'Aries':       'initiative, courage, new beginnings',
    'Taurus':      'stability, sensuality, endurance',
    'Gemini':      'communication, duality, curiosity',
    'Cancer':      'emotion, nurturing, home and roots',
    'Leo':         'creativity, confidence, self-expression',
    'Virgo':       'analysis, devotion, refinement',
    'Libra':       'balance, partnership, harmony',
    'Scorpio':     'transformation, depth, intensity',
    'Sagittarius': 'expansion, truth, freedom',
    'Capricorn':   'ambition, discipline, long-term structure',
    'Aquarius':    'innovation, community, higher ideals',
    'Pisces':      'intuition, dissolution, boundless compassion'
}

PLANET_NATURE = {
    'sun':     'identity and life force',
    'moon':    'emotions and instincts',
    'venus':   'love, beauty and values',
    'jupiter': 'expansion, wisdom and abundance',
    'saturn':  'discipline, karma and long cycles'
}


def get_position(planet_obj, ephem_date):
    planet_obj.compute(ephem_date)
    ecl = ephem.Ecliptic(planet_obj, epoch=ephem_date)
    lon_deg = math.degrees(float(ecl.lon)) % 360
    sign_idx = int(lon_deg / 30)
    deg_in_sign = lon_deg % 30
    deg = int(deg_in_sign)
    mins = int((deg_in_sign - deg) * 60)
    sign = SIGNS[sign_idx]
    return {
        'sign': sign,
        'degree': f"{deg}°{mins:02d}'",
        'longitude': round(lon_deg, 2),
        'energy': SIGN_ENERGY[sign]
    }


IST = timezone(timedelta(hours=5, minutes=30))
now_ist = datetime.now(IST)
now_utc = datetime.now(timezone.utc)

# pyephem works in UTC
ephem_date = ephem.Date(now_utc.strftime('%Y/%m/%d %H:%M:%S'))

positions = {
    'sun':     get_position(ephem.Sun(),     ephem_date),
    'moon':    get_position(ephem.Moon(),    ephem_date),
    'venus':   get_position(ephem.Venus(),   ephem_date),
    'jupiter': get_position(ephem.Jupiter(), ephem_date),
    'saturn':  get_position(ephem.Saturn(),  ephem_date),
}

# Human-readable block that goes directly into the AI prompt
prompt_lines = []
for planet, data in positions.items():
    prompt_lines.append(
        f"{planet.capitalize()} in {data['sign']} ({data['degree']}) "
        f"— {PLANET_NATURE[planet]} through {data['energy']}"
    )

output = {
    'date': now_ist.strftime('%Y-%m-%d'),
    'updated_ist': now_ist.strftime('%Y-%m-%dT%H:%M:%S+05:30'),
    'planets': positions,
    'prompt_block': '\n'.join(prompt_lines)
}

out_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'js', 'planets-today.json'
)

with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"Planets for {output['date']} written to {out_path}")
for line in prompt_lines:
    print(' ', line)
