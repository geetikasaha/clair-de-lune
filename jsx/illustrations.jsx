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

Object.assign(window, { Moon, Stag, ForestSilhouette, Dreamcatcher, TarotCardBack, Ornament, TriMoonGlyph });
