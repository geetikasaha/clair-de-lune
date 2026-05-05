// illustrations.jsx — all SVG illustrations for Clair de Lune
// Stag, moon, forest, dreamcatcher, charms, ornaments

const Moon = ({ size = 420, glow = true }) => (
  <svg width={size} height={size} viewBox="0 0 420 420" style={{ overflow: 'visible' }}>
    <defs>
      <radialGradient id="moonBody" cx="42%" cy="38%" r="62%">
        <stop offset="0%" stopColor="#fbf6e3" />
        <stop offset="55%" stopColor="#e9e0c3" />
        <stop offset="100%" stopColor="#c9bfa1" />
      </radialGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255, 244, 200, 0.55)" />
        <stop offset="40%" stopColor="rgba(220, 205, 160, 0.18)" />
        <stop offset="100%" stopColor="rgba(220, 205, 160, 0)" />
      </radialGradient>
      <filter id="moonBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    {glow && <circle cx="210" cy="210" r="210" fill="url(#moonGlow)" />}
    <circle cx="210" cy="210" r="150" fill="url(#moonBody)" />
    {/* craters */}
    <g fill="#b8ad8d" opacity="0.45" filter="url(#moonBlur)">
      <ellipse cx="170" cy="170" rx="22" ry="18" />
      <ellipse cx="240" cy="200" rx="14" ry="12" />
      <ellipse cx="195" cy="245" rx="28" ry="10" />
      <ellipse cx="260" cy="155" rx="9" ry="9" />
      <ellipse cx="155" cy="225" rx="11" ry="9" />
    </g>
    {/* face shadow */}
    <circle cx="210" cy="210" r="150" fill="#0d1812" opacity="0.0" />
  </svg>
);

const Stag = ({ width = 320, color = "#0d1812" }) => (
  <svg width={width} viewBox="0 0 320 360" fill={color} style={{ overflow: 'visible' }}>
    {/* antlers - intricate branching */}
    <g stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none">
      {/* left antler */}
      <path d="M140 95 Q128 70 118 55 Q108 40 95 30 M118 55 Q105 50 92 52 M118 55 Q120 38 115 22 M95 30 Q82 22 70 18 M115 22 Q108 10 100 5 M95 30 Q90 18 80 10" />
      {/* more left branches */}
      <path d="M132 80 Q118 75 105 78 M132 80 Q125 65 120 50" />
      {/* right antler */}
      <path d="M180 95 Q192 70 202 55 Q212 40 225 30 M202 55 Q215 50 228 52 M202 55 Q200 38 205 22 M225 30 Q238 22 250 18 M205 22 Q212 10 220 5 M225 30 Q230 18 240 10" />
      <path d="M188 80 Q202 75 215 78 M188 80 Q195 65 200 50" />
    </g>
    {/* head */}
    <path d="M160 100 Q138 100 132 125 Q128 145 138 165 Q145 178 160 182 Q175 178 182 165 Q192 145 188 125 Q182 100 160 100 Z" />
    {/* neck */}
    <path d="M148 178 Q145 200 152 220 L168 220 Q175 200 172 178 Z" />
    {/* body */}
    <path d="M152 218 Q120 224 105 245 Q95 268 102 295 L118 295 L120 270 Q122 258 132 256 L188 256 Q198 258 200 270 L202 295 L218 295 Q225 268 215 245 Q200 224 168 218 Z" />
    {/* legs */}
    <rect x="115" y="290" width="10" height="60" />
    <rect x="138" y="290" width="10" height="60" />
    <rect x="172" y="290" width="10" height="60" />
    <rect x="195" y="290" width="10" height="60" />
    {/* tail */}
    <path d="M218 250 Q230 248 232 238 Q228 244 220 244 Z" />
    {/* eye glow */}
    <circle cx="152" cy="138" r="2.5" fill="#fbf6e3" />
    <circle cx="168" cy="138" r="2.5" fill="#fbf6e3" />
  </svg>
);

const ForestSilhouette = ({ width = 1600, height = 320, color = "#040a07", layer = 0 }) => {
  // procedural pine forest silhouette
  const trees = [];
  const rng = (seed) => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };
  const r = rng(layer * 1000 + 7);
  let x = 0;
  while (x < width + 40) {
    const treeW = 40 + r() * 70;
    const treeH = 140 + r() * 160 + (layer === 0 ? 60 : 0);
    const top = height - treeH;
    const sway = r() * 6 - 3;
    trees.push({ x, w: treeW, h: treeH, top, sway });
    x += treeW * 0.55;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {trees.map((t, i) => {
        // Pine tree: trunk + triangular tiers
        const cx = t.x + t.w / 2 + t.sway;
        const tiers = 5;
        const path = [];
        for (let k = 0; k < tiers; k++) {
          const tierTop = t.top + (t.h * 0.05) + k * (t.h * 0.18);
          const tierBot = tierTop + t.h * 0.28;
          const halfW = (t.w / 2) * (0.4 + k * 0.16);
          path.push(`M${cx - halfW} ${tierBot} L${cx} ${tierTop} L${cx + halfW} ${tierBot} Z`);
        }
        return (
          <g key={i}>
            <rect x={cx - 4} y={t.top + t.h * 0.7} width="8" height={t.h * 0.32} fill={color} />
            <path d={path.join(' ')} fill={color} />
          </g>
        );
      })}
      <rect x="0" y={height - 8} width={width} height="20" fill={color} />
    </svg>
  );
};

const Dreamcatcher = ({ size = 240 }) => {
  const cx = size / 2, cy = size / 2 - 20, r = size / 2 - 30;
  // weave - lines from points around circle
  const N = 12;
  const points = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const weave = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 5) % N;
    weave.push(`M${points[i][0]} ${points[i][1]} L${points[j][0]} ${points[j][1]}`);
  }
  // inner star
  const innerN = 8;
  const innerR = r * 0.42;
  const innerPts = Array.from({ length: innerN }, (_, i) => {
    const a = (i / innerN) * Math.PI * 2;
    return [cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR];
  });
  const innerWeave = [];
  for (let i = 0; i < innerN; i++) {
    const j = (i + 3) % innerN;
    innerWeave.push(`M${innerPts[i][0]} ${innerPts[i][1]} L${innerPts[j][0]} ${innerPts[j][1]}`);
  }

  return (
    <svg width={size} height={size * 1.7} viewBox={`0 0 ${size} ${size * 1.7}`} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="dcGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="rgba(232, 220, 178, 0.35)" />
          <stop offset="100%" stopColor="rgba(232, 220, 178, 0)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 18} fill="url(#dcGlow)" />
      {/* hanging string */}
      <line x1={cx} y1={0} x2={cx} y2={cy - r} stroke="#7a6a48" strokeWidth="1" />
      {/* outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c9b988" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="#7a6a48" strokeWidth="0.6" opacity="0.6" />
      {/* weave */}
      <g stroke="#e8dcb2" strokeWidth="0.7" fill="none" opacity="0.85">
        {weave.map((d, i) => <path key={i} d={d} />)}
        {innerWeave.map((d, i) => <path key={'i' + i} d={d} />)}
      </g>
      <circle cx={cx} cy={cy} r="4" fill="#fbf6e3" opacity="0.9" />
      {/* hanging strings */}
      {[-1, 0, 1].map((k, i) => {
        const sx = cx + k * 30;
        const sy = cy + r;
        const ey = sy + 110 + Math.abs(k) * 30;
        return (
          <g key={i} className="dc-string" data-charm={i}>
            <line x1={sx} y1={sy} x2={sx} y2={ey} stroke="#7a6a48" strokeWidth="0.8" />
            {/* bead */}
            <circle cx={sx} cy={sy + 30} r="3" fill="#c9b988" />
            {/* charm at bottom */}
            <g transform={`translate(${sx}, ${ey})`}>
              {i === 0 && (
                /* feather */
                <g>
                  <path d="M0 0 Q-6 12 -3 28 Q0 36 3 28 Q6 12 0 0 Z" fill="#e8dcb2" stroke="#7a6a48" strokeWidth="0.5" />
                  <line x1="0" y1="6" x2="0" y2="32" stroke="#7a6a48" strokeWidth="0.4" />
                </g>
              )}
              {i === 1 && (
                /* crystal */
                <g>
                  <path d="M-5 0 L0 -6 L5 0 L3 22 L-3 22 Z" fill="rgba(200, 220, 240, 0.7)" stroke="#c9b988" strokeWidth="0.5" />
                  <path d="M-5 0 L0 8 L5 0" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
                </g>
              )}
              {i === 2 && (
                /* moon charm */
                <g>
                  <path d="M0 -6 A10 10 0 1 0 4 14 A8 8 0 1 1 0 -6 Z" fill="#e8dcb2" stroke="#7a6a48" strokeWidth="0.4" />
                </g>
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
};

const TarotCardBack = ({ width = 180 }) => {
  const h = width * 1.55;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <defs>
        <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f1f14" />
          <stop offset="100%" stopColor="#0d1812" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width={width - 6} height={h - 6} rx="8" fill="url(#cardBg)" stroke="#c9b988" strokeWidth="1.5" />
      <rect x="10" y="10" width={width - 20} height={h - 20} rx="4" fill="none" stroke="#7a6a48" strokeWidth="0.6" />
      {/* central moon */}
      <circle cx={width / 2} cy={h / 2} r={width * 0.18} fill="none" stroke="#c9b988" strokeWidth="1" />
      <circle cx={width / 2} cy={h / 2} r={width * 0.13} fill="#e8dcb2" opacity="0.15" />
      <path d={`M${width / 2 - 6} ${h / 2 - 10} A12 12 0 1 0 ${width / 2 + 4} ${h / 2 + 12} A10 10 0 1 1 ${width / 2 - 6} ${h / 2 - 10} Z`} fill="#e8dcb2" opacity="0.85" />
      {/* corner ornaments */}
      {[[15, 15], [width - 15, 15], [15, h - 15], [width - 15, h - 15]].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="#c9b988" />
      ))}
      {/* stars */}
      {[[width * 0.25, h * 0.25], [width * 0.75, h * 0.25], [width * 0.25, h * 0.75], [width * 0.75, h * 0.75]].map((p, i) => (
        <g key={'s' + i} transform={`translate(${p[0]}, ${p[1]})`}>
          <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#c9b988" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
};

const Ornament = ({ width = 200, color = "#c9b988" }) => (
  <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
    <line x1="0" y1="10" x2="80" y2="10" stroke={color} strokeWidth="0.6" />
    <line x1="120" y1="10" x2="200" y2="10" stroke={color} strokeWidth="0.6" />
    <circle cx="100" cy="10" r="4" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="100" cy="10" r="1.2" fill={color} />
    <circle cx="86" cy="10" r="1" fill={color} />
    <circle cx="114" cy="10" r="1" fill={color} />
  </svg>
);

const TriMoonGlyph = ({ size = 60, color = "#c9b988" }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 120 60" fill="none" stroke={color} strokeWidth="1.4">
    <path d="M30 30 A14 14 0 1 0 30 31 Z" fill={color} fillOpacity="0.2" />
    <circle cx="60" cy="30" r="14" />
    <path d="M90 30 A14 14 0 1 1 90 31 Z" fill={color} fillOpacity="0.2" transform="rotate(180 90 30)" />
  </svg>
);

const TarotCardFace = ({ cardName, size = 100 }) => {
  const s = size;
  const sk = "#d8c79a";
  const fl = "rgba(216,199,154,0.12)";
  const fm = "rgba(216,199,154,0.25)";
  const br = "#f0ead8";

  const map = {

    "0. The Fool": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <circle cx="78" cy="16" r="9" stroke={sk} strokeWidth="1" fill={fm} opacity="0.7"/>
        {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180;return <line key={i} x1={78+Math.cos(r)*12} y1={16+Math.sin(r)*12} x2={78+Math.cos(r)*17} y2={16+Math.sin(r)*17} stroke={sk} strokeWidth="0.7"/>;} )}
        <path d="M10 70 Q30 68 50 70" stroke={sk} strokeWidth="1.5"/>
        <path d="M50 70 L50 88 L85 88" stroke={sk} strokeWidth="1" opacity="0.35"/>
        <circle cx="48" cy="53" r="5" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M48 58 L48 68 M48 63 L42 60 M48 63 L57 58 M48 68 L44 76 M48 68 L53 76" stroke={sk} strokeWidth="1"/>
        <path d="M57 58 L65 48" stroke={sk} strokeWidth="0.8"/>
        <circle cx="67" cy="46" r="3.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <circle cx="40" cy="60" r="2.5" stroke={br} strokeWidth="0.7" fill="rgba(240,234,216,0.12)"/>
      </svg>
    ),

    "I. The Magician": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M33 20 C33 14 41 11 50 20 C59 29 67 26 67 20 C67 14 59 11 50 20 C41 29 33 26 33 20" stroke={sk} strokeWidth="1.2"/>
        <line x1="50" y1="26" x2="50" y2="58" stroke={sk} strokeWidth="1.5"/>
        <circle cx="50" cy="24" r="3" fill={fm} stroke={sk} strokeWidth="0.8"/>
        <circle cx="50" cy="46" r="5.5" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M44 52 L42 64 L58 64 L56 52" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M50 52 L43 56 M50 52 L57 54" stroke={sk} strokeWidth="1"/>
        <path d="M18 80 L82 80 L82 84 L18 84 Z" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M27 77 L30 71 L33 77 Z" fill={fm} stroke={sk} strokeWidth="0.5"/>
        <path d="M44 74 C44 71 48 71 48 74 C48 77 44 77 44 74" stroke={sk} strokeWidth="0.7"/>
        <rect x="53" y="72" width="7" height="7" stroke={sk} strokeWidth="0.7"/>
        <path d="M67 77 L71 71 M67 71 L71 77" stroke={sk} strokeWidth="0.8"/>
      </svg>
    ),

    "II. High Priestess": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect x="12" y="25" width="13" height="58" stroke={sk} strokeWidth="1" fill={fl}/>
        <rect x="75" y="25" width="13" height="58" stroke={sk} strokeWidth="1" fill={fl}/>
        <text x="16" y="43" fontSize="8" fill={sk} opacity="0.8">B</text>
        <text x="79" y="43" fontSize="8" fill={sk} opacity="0.8">J</text>
        <path d="M25 27 Q50 16 75 27" stroke={sk} strokeWidth="0.8"/>
        <path d="M25 37 Q50 28 75 37" stroke={sk} strokeWidth="0.5" opacity="0.5"/>
        <path d="M25 47 Q50 40 75 47" stroke={sk} strokeWidth="0.4" opacity="0.3"/>
        <circle cx="50" cy="44" r="7" stroke={sk} strokeWidth="1.1" fill={fl}/>
        <path d="M43 38 Q50 33 57 38" stroke={sk} strokeWidth="1"/>
        <circle cx="50" cy="36" r="3" stroke={sk} strokeWidth="0.7" fill="none"/>
        <rect x="37" y="58" width="26" height="15" rx="2" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <line x1="41" y1="62" x2="59" y2="62" stroke={sk} strokeWidth="0.5"/>
        <line x1="41" y1="65" x2="59" y2="65" stroke={sk} strokeWidth="0.5"/>
        <line x1="41" y1="68" x2="52" y2="68" stroke={sk} strokeWidth="0.5"/>
        <path d="M36 80 A14 14 0 1 0 64 80 A12 12 0 1 1 36 80" stroke={sk} strokeWidth="1" fill="none"/>
      </svg>
    ),

    "III. The Empress": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M10 84 Q25 76 40 80 Q55 72 70 78 Q82 74 90 80 L90 92 L10 92 Z" fill={fl} stroke={sk} strokeWidth="0.5" opacity="0.5"/>
        <circle cx="50" cy="40" r="8" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M38 32 L40 26 L46 30 L50 22 L54 30 L60 26 L62 32 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        {[42,50,58].map(x=><circle key={x} cx={x} cy="27" r="1.8" fill={sk}/>)}
        <path d="M42 48 Q40 62 38 78 L62 78 Q60 62 58 48 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <line x1="70" y1="36" x2="70" y2="70" stroke={sk} strokeWidth="1.5"/>
        <circle cx="70" cy="33" r="3.5" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <circle cx="22" cy="26" r="7" stroke={sk} strokeWidth="0.8" fill="none"/>
        <line x1="22" y1="33" x2="22" y2="40" stroke={sk} strokeWidth="0.8"/>
        <line x1="18" y1="37" x2="26" y2="37" stroke={sk} strokeWidth="0.8"/>
        <path d="M10 72 Q12 62 10 52 M10 62 Q14 59 16 55 M10 62 Q6 59 8 55" stroke={sk} strokeWidth="0.7"/>
        <path d="M16 76 Q18 66 16 56 M16 66 Q20 63 22 59 M16 66 Q12 63 14 59" stroke={sk} strokeWidth="0.7"/>
      </svg>
    ),

    "IV. The Emperor": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M10 68 L26 44 L42 62 L58 38 L74 58 L90 40 L95 68" stroke={sk} strokeWidth="0.8" fill={fl} opacity="0.5"/>
        <rect x="26" y="35" width="48" height="50" rx="2" stroke={sk} strokeWidth="1" fill={fl}/>
        <rect x="19" y="29" width="9" height="24" rx="2" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <rect x="72" y="29" width="9" height="24" rx="2" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <rect x="18" y="22" width="13" height="11" rx="3" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <rect x="69" y="22" width="13" height="11" rx="3" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <path d="M20 24 Q14 18 18 14 M30 24 Q36 18 32 14" stroke={sk} strokeWidth="0.8"/>
        <path d="M71 24 Q65 18 69 14 M81 24 Q87 18 83 14" stroke={sk} strokeWidth="0.8"/>
        <circle cx="50" cy="52" r="8" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M42 44 L43 38 L47 41 L50 35 L53 41 L57 38 L58 44" stroke={sk} strokeWidth="1" fill={fm}/>
        <line x1="72" y1="48" x2="72" y2="80" stroke={sk} strokeWidth="1.5"/>
        <circle cx="72" cy="45" r="4" stroke={sk} strokeWidth="0.8" fill="none"/>
        <circle cx="30" cy="72" r="6" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M30 66 L30 78 M24 72 L36 72" stroke={sk} strokeWidth="0.5"/>
      </svg>
    ),

    "V. Hierophant": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect x="10" y="18" width="14" height="74" stroke={sk} strokeWidth="1" fill={fl}/>
        <rect x="76" y="18" width="14" height="74" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M24 18 Q50 5 76 18" stroke={sk} strokeWidth="1" fill="none"/>
        <circle cx="50" cy="34" r="8" stroke={sk} strokeWidth="1.1" fill={fl}/>
        <rect x="42" y="18" width="16" height="6" rx="1" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <rect x="44" y="14" width="12" height="6" rx="1" stroke={sk} strokeWidth="0.7" fill={fm}/>
        <rect x="46" y="10" width="8" height="6" rx="1" stroke={sk} strokeWidth="0.6" fill={fm}/>
        <path d="M42 42 L40 72 L60 72 L58 42 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <line x1="65" y1="22" x2="65" y2="74" stroke={sk} strokeWidth="1.5"/>
        <line x1="60" y1="30" x2="70" y2="30" stroke={sk} strokeWidth="1.2"/>
        <line x1="61" y1="36" x2="69" y2="36" stroke={sk} strokeWidth="1"/>
        <line x1="62" y1="42" x2="68" y2="42" stroke={sk} strokeWidth="0.8"/>
        <circle cx="32" cy="68" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <circle cx="50" cy="72" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M36 80 L40 88 M40 80 L34 88" stroke={sk} strokeWidth="0.8" opacity="0.6"/>
        <circle cx="38" cy="79" r="3" stroke={sk} strokeWidth="0.7" fill="none"/>
      </svg>
    ),

    "VI. The Lovers": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="16" r="11" stroke={sk} strokeWidth="0.8" fill={fm} opacity="0.6"/>
        <circle cx="50" cy="12" r="5.5" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M44 14 Q30 8 26 20 Q31 17 44 22" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M56 14 Q70 8 74 20 Q69 17 56 22" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <line x1="50" y1="18" x2="50" y2="28" stroke={sk} strokeWidth="1"/>
        <circle cx="64" cy="46" r="6" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M64 52 L64 70 M60 60 L55 65 M64 60 L69 65 M64 70 L60 80 M64 70 L68 80" stroke={sk} strokeWidth="1"/>
        <circle cx="36" cy="46" r="6" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M36 52 Q32 62 34 70 L38 70 Q40 62 38 58" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M36 57 L31 62 M36 57 L41 62" stroke={sk} strokeWidth="1"/>
        <path d="M20 80 L20 50 M20 58 Q14 54 12 48 M20 58 Q15 50 18 44 M20 56 Q26 52 28 46" stroke={sk} strokeWidth="0.8"/>
        <circle cx="12" cy="46" r="3" fill={fm} stroke={sk} strokeWidth="0.6"/>
        <path d="M20 64 Q26 61 28 56" stroke={sk} strokeWidth="0.7" fill="none"/>
      </svg>
    ),

    "VII. The Chariot": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect x="26" y="38" width="48" height="32" rx="4" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M23 38 L50 26 L77 38" stroke={sk} strokeWidth="1" fill={fl}/>
        {[36,50,64].map(x=><path key={x} d={`M${x} 31 L${x+0.8} 34 L${x+4} 34 L${x+1.2} 36 L${x+2.4} 39 L${x} 37 L${x-2.4} 39 L${x-1.2} 36 L${x-4} 34 L${x-0.8} 34 Z`} fill={sk} opacity="0.5"/>)}
        <path d="M42 38 L40 34 L44 37 L50 31 L56 37 L60 34 L58 38" stroke={sk} strokeWidth="1" fill={fm}/>
        <path d="M42 54 Q50 48 58 54 M44 54 Q38 57 36 54 M56 54 Q62 57 64 54" stroke={sk} strokeWidth="0.8"/>
        <circle cx="36" cy="72" r="9" stroke={sk} strokeWidth="1" fill={fl}/>
        <circle cx="64" cy="72" r="9" stroke={sk} strokeWidth="1" fill={fl}/>
        <line x1="36" y1="63" x2="36" y2="81" stroke={sk} strokeWidth="0.5"/>
        <line x1="27" y1="72" x2="45" y2="72" stroke={sk} strokeWidth="0.5"/>
        <line x1="64" y1="63" x2="64" y2="81" stroke={sk} strokeWidth="0.5"/>
        <line x1="55" y1="72" x2="73" y2="72" stroke={sk} strokeWidth="0.5"/>
        <path d="M14 80 Q12 70 18 66 Q24 63 30 66 Q34 63 38 66 L38 80 Z" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <path d="M62 80 L62 66 Q66 63 72 66 Q78 63 82 68 Q86 72 82 80 Z" stroke={sk} strokeWidth="0.8" fill={fl}/>
      </svg>
    ),

    "VIII. Strength": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M30 20 C30 14 39 11 50 20 C61 29 70 26 70 20 C70 14 61 11 50 20 C39 29 30 26 30 20" stroke={sk} strokeWidth="1.5"/>
        <circle cx="38" cy="42" r="7" stroke={sk} strokeWidth="1" fill={fl}/>
        {[32,38,44].map(x=><circle key={x} cx={x} cy="36" r="2.2" stroke={sk} strokeWidth="0.6" fill={fm}/>)}
        <path d="M31 49 Q29 60 30 74 L46 74 Q47 60 45 49 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M45 49 Q54 47 62 51" stroke={sk} strokeWidth="1.2"/>
        <path d="M31 50 Q38 52 44 50" stroke={sk} strokeWidth="1"/>
        <path d="M52 50 Q78 45 84 60 Q84 78 70 80 Q54 80 51 70 Q47 60 52 50" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M52 50 Q49 42 56 40 Q63 38 67 43 Q71 38 76 42 Q80 46 77 52" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <ellipse cx="65" cy="60" rx="2.5" ry="2" fill={sk} opacity="0.4"/>
        <path d="M59 66 Q65 70 71 66" stroke={sk} strokeWidth="0.8"/>
        <path d="M62 51 Q64 49 67 51" stroke={br} strokeWidth="1.2"/>
      </svg>
    ),

    "IX. The Hermit": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        {[[14,16],[26,10],[72,13],[84,19],[62,21],[36,26]].map(([x,y],i)=>(
          <path key={i} d={`M${x} ${y} L${x+0.5} ${y-2.5} L${x+3} ${y-2.5} L${x+1} ${y-1} L${x+2} ${y+2.5} L${x} ${y+0.5} L${x-2} ${y+2.5} L${x-1} ${y-1} L${x-3} ${y-2.5} L${x-0.5} ${y-2.5} Z`} fill={sk} opacity="0.65"/>
        ))}
        <path d="M8 90 L50 22 L92 90 Z" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M44 36 L50 22 L56 36 Q53 34 50 35 Q47 34 44 36 Z" fill={fm} stroke={sk} strokeWidth="0.6"/>
        <circle cx="50" cy="56" r="7" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M43 63 Q41 72 43 82 L57 82 Q59 72 57 63 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <line x1="60" y1="54" x2="66" y2="84" stroke={sk} strokeWidth="1.5"/>
        <line x1="43" y1="62" x2="34" y2="51" stroke={sk} strokeWidth="1"/>
        <rect x="29" y="44" width="9" height="11" rx="1" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <path d="M31" y1="42" x2="35" y2="42" stroke={sk} strokeWidth="0.7"/>
        <line x1="31" y1="42" x2="35" y2="42" stroke={sk} strokeWidth="0.7"/>
        <line x1="33" y1="40" x2="33" y2="44" stroke={sk} strokeWidth="0.7"/>
        <circle cx="33" cy="49" r="5" fill="rgba(216,199,154,0.18)"/>
        <circle cx="33" cy="49" r="2.5" fill="rgba(216,199,154,0.25)"/>
      </svg>
    ),

    "X. Wheel of Fortune": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="54" r="36" stroke={sk} strokeWidth="1.5" fill="none"/>
        <circle cx="50" cy="54" r="28" stroke={sk} strokeWidth="0.8" fill="none"/>
        <circle cx="50" cy="54" r="8" stroke={sk} strokeWidth="1" fill={fl}/>
        {[0,45,90,135].map(a=>{const r=a*Math.PI/180;return <line key={a} x1={50+Math.cos(r)*8} y1={54+Math.sin(r)*8} x2={50+Math.cos(r)*28} y2={54+Math.sin(r)*28} stroke={sk} strokeWidth="1"/>;} )}
        {['T','A','R','O'].map((l,i)=>{const a=(i/4)*Math.PI*2-Math.PI/2;return <text key={i} x={50+Math.cos(a)*33} y={54+Math.sin(a)*33+3} fontSize="7" fill={sk} textAnchor="middle">{l}</text>;})}
        <path d="M42 16 Q50 10 58 16 Q60 21 50 24 Q40 21 42 16" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <path d="M86 44 Q92 40 90 50 Q89 57 83 58 Q83 52 86 44" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M14 42 Q10 50 14 58 Q17 62 22 60 Q20 54 17 48 Q15 45 17 42" stroke={sk} strokeWidth="0.8" fill="none"/>
        <circle cx="50" cy="54" r="3" fill={sk} opacity="0.4"/>
      </svg>
    ),

    "XI. Justice": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M34 17 L36 11 L42 15 L50 8 L58 15 L64 11 L66 17 L34 17 Z" stroke={sk} strokeWidth="1" fill={fm}/>
        <rect x="34" y="17" width="32" height="6" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <circle cx="50" cy="36" r="7.5" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M42 43 L40 66 L60 66 L58 43 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <line x1="70" y1="16" x2="70" y2="70" stroke={sk} strokeWidth="2"/>
        <path d="M65 21 L75 21" stroke={sk} strokeWidth="1.5"/>
        <path d="M70 16 L68 21 L72 21 Z" fill={sk}/>
        <line x1="30" y1="38" x2="30" y2="56" stroke={sk} strokeWidth="1.2"/>
        <line x1="18" y1="50" x2="42" y2="50" stroke={sk} strokeWidth="1"/>
        <path d="M18 50 Q18 58 24 58 Q30 58 30 50" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M30 50 Q30 58 36 58 Q42 58 42 50" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <line x1="16" y1="24" x2="16" y2="86" stroke={sk} strokeWidth="0.5" opacity="0.35"/>
        <line x1="84" y1="24" x2="84" y2="86" stroke={sk} strokeWidth="0.5" opacity="0.35"/>
      </svg>
    ),

    "XII. Hanged Man": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <line x1="50" y1="14" x2="50" y2="82" stroke={sk} strokeWidth="3" strokeLinecap="round"/>
        <line x1="24" y1="24" x2="76" y2="24" stroke={sk} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M50 82 Q40 87 34 92 M50 82 Q60 87 66 92" stroke={sk} strokeWidth="1.5"/>
        <path d="M50 24 L50 33" stroke={sk} strokeWidth="1.2"/>
        <path d="M50 33 L50 50 M50 42 L42 38 M50 42 L58 38" stroke={sk} strokeWidth="1.2"/>
        <path d="M50 33 L43 25 L36 32" stroke={sk} strokeWidth="1" opacity="0.6"/>
        <path d="M46 50 L54 50 L52 62 L48 62 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <circle cx="50" cy="68" r="9" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <circle cx="50" cy="68" r="13" stroke={sk} strokeWidth="0.7" fill="rgba(216,199,154,0.05)" strokeDasharray="2 2"/>
        <path d="M45 68 Q50 72 55 68" stroke={sk} strokeWidth="0.8"/>
      </svg>
    ),

    "XIII. Death": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M10 64 L90 64" stroke={sk} strokeWidth="0.8" opacity="0.5"/>
        <circle cx="50" cy="64" r="20" stroke={sk} strokeWidth="0.8" fill={fm} opacity="0.4"/>
        {[0,30,60,120,150,180].map((a,i)=>{const r=a*Math.PI/180;const x1=50+Math.cos(r)*20,y1=64+Math.sin(r)*20,x2=50+Math.cos(r)*26,y2=64+Math.sin(r)*26;if(y1>64)return null;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sk} strokeWidth="0.6"/>;} )}
        <path d="M14 80 Q14 60 24 55 Q30 52 36 55 Q38 50 42 52 L44 65 Q38 68 28 70 Q20 72 18 80 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <circle cx="40" cy="40" r="7.5" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M37 40 L43 40 M40 37 L40 43" stroke={sk} strokeWidth="1.5"/>
        <circle cx="37" cy="43" r="2.2" fill={sk} opacity="0.35"/>
        <circle cx="43" cy="43" r="2.2" fill={sk} opacity="0.35"/>
        <path d="M36 47 L38 56 M40 47 L40 56 M44 47 L42 56 M36 50 L44 50 M36 53 L44 53" stroke={sk} strokeWidth="0.6"/>
        <line x1="60" y1="18" x2="60" y2="60" stroke={sk} strokeWidth="1.5"/>
        <rect x="60" y="18" width="26" height="20" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <circle cx="71" cy="28" r="4.5" stroke={br} strokeWidth="0.8" fill="rgba(240,234,216,0.12)"/>
        <path d="M71 23 L71 18 M68 25 L64 22 M74 25 L78 22" stroke={br} strokeWidth="0.6"/>
      </svg>
    ),

    "XIV. Temperance": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="10" r="8" stroke={sk} strokeWidth="0.8" fill={fm} opacity="0.6"/>
        <path d="M30 90 L50 58 L70 90" stroke={sk} strokeWidth="0.8" fill={fl} opacity="0.35"/>
        <circle cx="50" cy="38" r="8.5" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M41 40 Q26 30 22 40 Q26 38 41 45" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M59 40 Q74 30 78 40 Q74 38 59 45" stroke={sk} strokeWidth="1" fill={fl}/>
        <rect x="44" y="48" width="12" height="12" stroke={sk} strokeWidth="0.8"/>
        <path d="M50 50 L44 60 L56 60 Z" stroke={sk} strokeWidth="0.6" fill={fm}/>
        <path d="M28 60 Q26 72 30 74 L37 74 Q41 72 39 60 Z" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M61 60 Q59 72 63 74 L70 74 Q74 72 72 60 Z" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M37 66 Q50 56 63 66" stroke={sk} strokeWidth="0.8" fill="none"/>
        <path d="M37 69 Q50 61 63 69" stroke={sk} strokeWidth="0.5" fill="none" opacity="0.6"/>
        <path d="M26 78 L26 88 M26 78 Q22 74 24 70 M26 78 Q30 74 28 70" stroke={sk} strokeWidth="0.7"/>
        <path d="M74 78 L74 88 M74 78 Q70 74 72 70 M74 78 Q78 74 76 70" stroke={sk} strokeWidth="0.7"/>
      </svg>
    ),

    "XV. The Devil": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M50 18 L56 30 L68 26 L60 38 L64 50 L50 44 L36 50 L40 38 L32 26 L44 30 Z" stroke={sk} strokeWidth="0.8" fill="rgba(216,199,154,0.05)"/>
        <path d="M28 50 Q28 34 50 31 Q72 34 72 50 Q72 63 50 66 Q28 63 28 50" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M33 40 Q25 24 18 16 M36 37 Q32 26 29 18" stroke={sk} strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M67 40 Q75 24 82 16 M64 37 Q68 26 71 18" stroke={sk} strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M28 48 Q20 46 22 53 Q24 56 28 54" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M72 48 Q80 46 78 53 Q76 56 72 54" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M38 50 L42 47 L42 53 Z" fill={sk} opacity="0.65"/>
        <path d="M62 50 L58 47 L58 53 Z" fill={sk} opacity="0.65"/>
        <line x1="50" y1="29" x2="50" y2="20" stroke={sk} strokeWidth="1.2"/>
        <path d="M46 20 Q50 14 54 20 Q50 17 46 20" stroke={sk} strokeWidth="0.7" fill={fm}/>
        <circle cx="30" cy="84" r="5.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M30 90 L30 97 M27 93 L33 93" stroke={sk} strokeWidth="0.8"/>
        <circle cx="70" cy="84" r="5.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M70 90 L70 97 M67 93 L73 93" stroke={sk} strokeWidth="0.8"/>
        <path d="M30 76 Q41 70 50 68 Q59 70 70 76" stroke={sk} strokeWidth="0.6" strokeDasharray="2 2"/>
      </svg>
    ),

    "XVI. The Tower": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M10 24 Q20 18 30 24 Q36 16 46 21 Q52 14 62 19 Q72 13 82 20 Q87 17 93 23 L93 28 L10 28 Z" fill={fl} opacity="0.3"/>
        <rect x="28" y="28" width="44" height="58" stroke={sk} strokeWidth="1.5" fill={fl}/>
        <rect x="44" y="43" width="12" height="18" rx="2" stroke={sk} strokeWidth="0.8" fill="rgba(216,199,154,0.06)"/>
        <path d="M28 28 L28 22 L35 22 L35 28 M42 28 L42 20 L50 20 L50 28 M57 28 L57 22 L64 22 L64 28 M72 28 L72 26 L76 26 L76 28" stroke={sk} strokeWidth="1"/>
        <path d="M36 21 L37 14 L43 18 L50 11 L57 18 L63 14 L64 21" stroke={sk} strokeWidth="1" fill={fm} opacity="0.7" transform="rotate(-22 50 16)"/>
        <path d="M76 8 L60 38 L68 38 L50 72" stroke={sk} strokeWidth="2"/>
        <path d="M76 8 L60 38 L68 38 L50 72" stroke={br} strokeWidth="0.8" opacity="0.5"/>
        <circle cx="20" cy="60" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M20 64 L18 74 M18 70 L13 67 M18 70 L23 69 M18 74 L14 80 M18 74 L22 81" stroke={sk} strokeWidth="0.8" transform="rotate(-28 18 72)"/>
        <circle cx="84" cy="62" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M84 66 L86 76 M86 72 L81 70 M86 72 L91 72 M86 76 L82 82 M86 76 L90 82" stroke={sk} strokeWidth="0.8" transform="rotate(22 84 74)"/>
        {[[56,30],[62,26],[67,33]].map(([x,y],i)=><path key={i} d={`M${x} ${y} Q${x-2} ${y-5} ${x} ${y-8} Q${x+2} ${y-5} ${x} ${y}`} fill={fm} opacity="0.5"/>)}
      </svg>
    ),

    "XVII. The Star": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M50 10 L52 22 L64 20 L55 28 L64 36 L52 32 L50 44 L48 32 L36 36 L45 28 L36 20 L48 22 Z" stroke={sk} strokeWidth="1" fill={fm}/>
        {[[16,22],[82,18],[92,52],[80,78],[52,90],[20,78],[8,50]].map(([x,y],i)=>(
          <path key={i} d={`M${x} ${y} L${x+0.8} ${y-3} L${x+4} ${y-3} L${x+1.2} ${y-1} L${x+2.4} ${y+3} L${x} ${y+1} L${x-2.4} ${y+3} L${x-1.2} ${y-1} L${x-4} ${y-3} L${x-0.8} ${y-3} Z`} fill={sk} opacity="0.45"/>
        ))}
        <path d="M8 73 Q28 68 50 73 Q72 68 92 73 L92 92 L8 92 Z" fill={fl} opacity="0.28"/>
        <path d="M8 76 Q28 72 50 76" stroke={sk} strokeWidth="0.4" opacity="0.4"/>
        <circle cx="38" cy="60" r="5.5" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M38 65 L38 74 M34 70 L42 70" stroke={sk} strokeWidth="1"/>
        <path d="M38 74 L34 80 L42 80" stroke={sk} strokeWidth="1"/>
        <path d="M30 68 Q25 71 22 74 L27 74 Q30 71 33 69 Z" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M46 65 Q51 70 54 74 L50 74 Q47 70 45 67 Z" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M22 74 Q16 78 14 84" stroke={sk} strokeWidth="0.6" fill="none"/>
        <path d="M54 74 Q58 76 60 80" stroke={sk} strokeWidth="0.6" fill="none"/>
      </svg>
    ),

    "XVIII. The Moon": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="20" r="15" stroke={sk} strokeWidth="1.2" fill={fm}/>
        <ellipse cx="44" cy="18" rx="3" ry="2" fill={sk} opacity="0.35"/>
        <ellipse cx="56" cy="18" rx="3" ry="2" fill={sk} opacity="0.35"/>
        <path d="M44 25 Q50 28 56 25" stroke={sk} strokeWidth="0.8"/>
        {[200,220,240,300,320,340].map((a,i)=>{const r=a*Math.PI/180;return <line key={i} x1={50+Math.cos(r)*15} y1={20+Math.sin(r)*15} x2={50+Math.cos(r)*19} y2={20+Math.sin(r)*19} stroke={sk} strokeWidth="0.6" opacity="0.5"/>;} )}
        <rect x="16" y="44" width="13" height="32" stroke={sk} strokeWidth="1" fill={fl}/>
        <rect x="71" y="44" width="13" height="32" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M29 78 Q50 70 71 78 L71 92 L29 92 Z" fill={fl} opacity="0.25"/>
        <path d="M36 92 Q50 80 64 92" stroke={sk} strokeWidth="1" fill="none"/>
        <circle cx="26" cy="66" r="5.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M24 61 Q20 55 23 52 Q27 48 30 52 Q30 48 33 46 Q31 52 29 55 Q27 58 26 61" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M26 71 L23 79 M23 75 L18 75 M23 75 L25 79 M26 79 L26 86" stroke={sk} strokeWidth="0.8"/>
        <circle cx="74" cy="66" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M72 62 L70 57 L74 60" stroke={sk} strokeWidth="0.7"/>
        <path d="M74 70 L72 78 M72 75 L67 75 M72 75 L74 79" stroke={sk} strokeWidth="0.8"/>
        <path d="M78 68 L84 66" stroke={sk} strokeWidth="0.6"/>
        <path d="M44 86 Q50 83 56 86 Q58 88 56 90 Q50 92 44 90 Q42 88 44 86" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M42 87 L38 86 M42 88 L38 88 M58 87 L62 86 M58 88 L62 88" stroke={sk} strokeWidth="0.5"/>
      </svg>
    ),

    "XIX. The Sun": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="30" r="18" stroke={sk} strokeWidth="1.2" fill={fm}/>
        {Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return <line key={i} x1={50+Math.cos(a)*20} y1={30+Math.sin(a)*20} x2={50+Math.cos(a)*(i%2===0?28:25)} y2={30+Math.sin(a)*(i%2===0?28:25)} stroke={sk} strokeWidth={i%2===0?"1.2":"0.7"}/>;} )}
        <circle cx="44" cy="28" r="2.5" fill={sk} opacity="0.45"/>
        <circle cx="56" cy="28" r="2.5" fill={sk} opacity="0.45"/>
        <path d="M44 35 Q50 38 56 35" stroke={sk} strokeWidth="1"/>
        <path d="M10 72 L90 72" stroke={sk} strokeWidth="1.5"/>
        {[12,22,32,42,52,62,72,82].map(x=><rect key={x} x={x} y="68" width="7" height="6" stroke={sk} strokeWidth="0.5" fill={fl}/>)}
        <line x1="19" y1="50" x2="19" y2="72" stroke={sk} strokeWidth="1.2"/>
        <circle cx="19" cy="47" r="5.5" stroke={sk} strokeWidth="0.8" fill={fm}/>
        {[0,60,120,180,240,300].map((a,i)=>{const r=a*Math.PI/180;return <path key={i} d={`M${19+Math.cos(r)*5.5} ${47+Math.sin(r)*5.5} Q${19+Math.cos(r)*9} ${47+Math.sin(r)*9} ${19+Math.cos(r)*7.5} ${47+Math.sin(r)*7.5}`} stroke={sk} strokeWidth="0.6"/>;} )}
        <line x1="81" y1="54" x2="81" y2="72" stroke={sk} strokeWidth="1.2"/>
        <circle cx="81" cy="51" r="5.5" stroke={sk} strokeWidth="0.8" fill={fm}/>
        <circle cx="50" cy="56" r="6.5" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M44 52 Q50 47 56 52" stroke={sk} strokeWidth="0.8"/>
        <path d="M44 62 Q42 68 44 72 L56 72 Q58 68 56 62 Z" stroke={sk} strokeWidth="1" fill={fl}/>
        <line x1="57" y1="53" x2="57" y2="43" stroke={sk} strokeWidth="1"/>
        <path d="M57 43 L70 47 L57 51 Z" stroke={sk} strokeWidth="0.7" fill={fm}/>
      </svg>
    ),

    "XX. Judgement": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <path d="M8 18 Q18 12 28 18 Q34 11 44 16 Q50 9 60 14 Q70 9 80 15 Q86 12 94 18 L94 22 L8 22 Z" fill={fl} opacity="0.35"/>
        <circle cx="50" cy="20" r="7.5" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M42 22 Q26 16 20 28 Q26 24 42 30" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M58 22 Q74 16 80 28 Q74 24 58 30" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M50 28 L50 38 Q54 40 60 38 Q63 35 60 32 Q56 30 50 38" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M60 38 L72 42 Q76 44 74 49 Q70 44 60 42" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <line x1="50" y1="13" x2="50" y2="6" stroke={sk} strokeWidth="1"/>
        <path d="M50 6 L62 10 L50 14 Z" fill={sk} opacity="0.35"/>
        <path d="M54 8 L54 11 M52 9.5 L56 9.5" stroke={br} strokeWidth="0.6"/>
        <path d="M8 72 Q24 67 40 72 Q56 67 72 72 Q82 67 92 72 L92 92 L8 92 Z" fill={fl} opacity="0.18"/>
        <path d="M8 72 L92 72" stroke={sk} strokeWidth="0.5" opacity="0.4"/>
        <path d="M16 72 L16 61 L27 57 L38 61 L38 72" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M42 72 L42 59 L50 55 L58 59 L58 72" stroke={sk} strokeWidth="1" fill={fl}/>
        <path d="M62 72 L62 61 L73 57 L84 61 L84 72" stroke={sk} strokeWidth="1" fill={fl}/>
        <circle cx="27" cy="61" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M25 57 L27 51 M27 51 L22 47 M27 51 L32 47" stroke={sk} strokeWidth="0.8"/>
        <circle cx="50" cy="59" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M48 55 L50 49 M50 49 L45 45 M50 49 L55 45" stroke={sk} strokeWidth="0.8"/>
        <circle cx="73" cy="61" r="4.5" stroke={sk} strokeWidth="0.8" fill={fl}/>
        <path d="M71 57 L73 51 M73 51 L68 47 M73 51 L78 47" stroke={sk} strokeWidth="0.8"/>
      </svg>
    ),

    "XXI. The World": () => (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="50" rx="33" ry="43" stroke={sk} strokeWidth="1.5" fill="none"/>
        <ellipse cx="50" cy="50" rx="29" ry="39" stroke={sk} strokeWidth="0.5" fill="rgba(216,199,154,0.03)"/>
        {Array.from({length:18},(_,i)=>{const a=(i/18)*Math.PI*2;const rx=33,ry=43;const x=50+Math.cos(a)*rx,y=50+Math.sin(a)*ry;const nx=Math.cos(a),ny=Math.sin(a)*ry/rx;const len=Math.sqrt(nx*nx+ny*ny);const lx=nx/len*4.5,ly=ny/len*4.5;return <path key={i} d={`M${x} ${y} Q${x-ly*0.7} ${y+lx*0.7} ${x-lx*1.8} ${y-ly*1.8} Q${x+ly*0.7} ${y-lx*0.7} ${x} ${y}`} fill={fm} opacity="0.45"/>;} )}
        <circle cx="50" cy="42" r="6.5" stroke={sk} strokeWidth="1.2" fill={fl}/>
        <path d="M50 48 L50 62" stroke={sk} strokeWidth="1.2"/>
        <path d="M50 54 L40 48 M50 54 L60 48" stroke={sk} strokeWidth="1.2"/>
        <path d="M50 62 L44 70 M50 62 L58 72" stroke={sk} strokeWidth="1.2"/>
        <line x1="38" y1="46" x2="32" y2="42" stroke={sk} strokeWidth="1"/>
        <line x1="62" y1="46" x2="68" y2="42" stroke={sk} strokeWidth="1"/>
        <circle cx="10" cy="14" r="5.5" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M7 16 Q3 11 6 9 Q7.5 13 7 16 M13 16 Q17 11 14 9 Q12.5 13 13 16" stroke={sk} strokeWidth="0.5"/>
        <path d="M88 13 L82 18 L87 16 L82 22 L88 18 L94 22 L88 16 L94 18 L88 13" stroke={sk} strokeWidth="0.6" fill={fl}/>
        <circle cx="10" cy="86" r="5.5" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M7 83 Q5 80 8 80 M13 83 Q15 80 12 80" stroke={sk} strokeWidth="0.6"/>
        <circle cx="88" cy="86" r="5.5" stroke={sk} strokeWidth="0.7" fill={fl}/>
        <path d="M84 84 Q82 82 84 80 Q86 82 84 84" stroke={sk} strokeWidth="0.5" fill={fm}/>
        <path d="M85 88 Q88 92 90 90" stroke={sk} strokeWidth="0.5"/>
      </svg>
    ),

  };

  const render = map[cardName];
  if (!render) return <Moon size={size} glow={false} />;
  return render();
};

Object.assign(window, { Moon, Stag, ForestSilhouette, Dreamcatcher, TarotCardBack, Ornament, TriMoonGlyph, TarotCardFace });
