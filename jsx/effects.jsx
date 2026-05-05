// effects.jsx — firefly cursor trail, constellation canvas, ambient sound

const FireflyCursor = ({ intensity = 8 }) => {
  const canvasRef = React.useRef(null);
  const fliesRef = React.useRef([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const spawnRate = Math.max(0.05, intensity / 12);
      if (Math.random() < spawnRate) {
        fliesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
          life: 1,
          decay: 0.006 + Math.random() * 0.008,
          size: 1 + Math.random() * 2.5,
          hue: 45 + Math.random() * 20,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      const flies = fliesRef.current;
      for (let i = flies.length - 1; i >= 0; i--) {
        const f = flies[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.005; // slow drift, almost neutral
        f.life -= f.decay;
        f.twinkle += 0.15;
        if (f.life <= 0) {
          flies.splice(i, 1);
          continue;
        }
        const alpha = f.life * (0.6 + 0.4 * Math.sin(f.twinkle));
        const s = f.size;
        // glow
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, s * 6);
        grad.addColorStop(0, `hsla(${f.hue}, 90%, 75%, ${alpha * 0.8})`);
        grad.addColorStop(0.4, `hsla(${f.hue}, 80%, 65%, ${alpha * 0.25})`);
        grad.addColorStop(1, `hsla(${f.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, s * 6, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = `hsla(${f.hue}, 100%, 92%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, s, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className="firefly-canvas" />;
};

const StarField = ({ count = 120, intensity = 8 }) => {
  // static-ish star layer with subtle twinkle
  const stars = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 1.6 + 0.4,
      delay: Math.random() * 5,
      dur: 2 + Math.random() * 4,
      op: 0.3 + Math.random() * 0.6
    }));
  }, [count]);
  return (
    <div className="starfield">
      {stars.map((s, i) => (
        <span key={i} className="star" style={{
          left: s.x + '%',
          top: s.y + '%',
          width: s.s + 'px',
          height: s.s + 'px',
          opacity: s.op,
          animationDelay: s.delay + 's',
          animationDuration: s.dur + 's'
        }} />
      ))}
    </div>
  );
};

const Constellation = () => {
  // Constellations form as user scrolls through the page.
  // Each constellation is a set of points + lines that connect progressively.
  const ref = React.useRef(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Define a few constellations spread across page height (vh-relative)
  const constellations = React.useMemo(() => ([
    {
      // Stag (head outline)
      anchorY: 30, // %
      x: 12, // %
      pts: [[0, 30], [10, 10], [18, 0], [30, 8], [38, 25], [42, 45], [30, 55], [18, 55], [10, 50], [0, 30]],
      threshold: 0.05
    },
    {
      // Crescent moon
      anchorY: 110,
      x: 78,
      pts: [[20, 0], [10, 10], [4, 25], [4, 45], [10, 60], [20, 70], [14, 40], [20, 0]],
      threshold: 0.18
    },
    {
      // Triangle / mountain
      anchorY: 200,
      x: 8,
      pts: [[0, 50], [25, 0], [50, 50], [0, 50]],
      threshold: 0.35
    },
    {
      // Star with flourish
      anchorY: 290,
      x: 70,
      pts: [[20, 0], [25, 18], [44, 18], [29, 30], [35, 50], [20, 38], [5, 50], [11, 30], [-4, 18], [15, 18], [20, 0]],
      threshold: 0.55
    },
    {
      // Tree / antlers
      anchorY: 380,
      x: 18,
      pts: [[20, 60], [20, 30], [10, 20], [0, 10], [10, 20], [20, 30], [30, 20], [40, 10], [30, 20], [20, 30]],
      threshold: 0.72
    }
  ]), []);

  return (
    <svg ref={ref} className="constellation-layer" preserveAspectRatio="none">
      {constellations.map((c, ci) => {
        const localProgress = Math.min(1, Math.max(0, (progress - c.threshold) / 0.18));
        const visiblePoints = Math.floor(localProgress * c.pts.length);
        return (
          <g key={ci} style={{ transform: `translate(${c.x}vw, ${c.anchorY}vh)` }}>
            {c.pts.map((p, i) => i < c.pts.length - 1 && (
              <line
                key={i}
                x1={p[0]} y1={p[1]}
                x2={c.pts[i + 1][0]} y2={c.pts[i + 1][1]}
                stroke="rgba(232, 220, 178, 0.5)"
                strokeWidth="0.4"
                opacity={i < visiblePoints ? 1 : 0}
                style={{ transition: 'opacity 0.6s ease' }}
              />
            ))}
            {c.pts.map((p, i) => (
              <circle
                key={'p' + i}
                cx={p[0]} cy={p[1]} r="0.8"
                fill="rgba(255, 247, 215, 0.95)"
                opacity={i <= visiblePoints ? 1 : 0.15}
                style={{ transition: 'opacity 0.5s ease' }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// Ambient sound — uses WebAudio to synthesize a soft drone (no external file)
const useAmbientSound = () => {
  const ctxRef = React.useRef(null);
  const nodesRef = React.useRef(null);
  const [on, setOn] = React.useState(false);

  const start = () => {
    if (ctxRef.current) {
      ctxRef.current.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    // soft moon drone: two detuned sine pads + filtered noise
    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);

    const padFreqs = [110, 165, 220];
    const oscs = padFreqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      // slow LFO on gain for breathing
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08 + i * 0.04;
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      o.connect(g).connect(master);
      o.start();
      return o;
    });

    // gentle noise (wind-ish)
    const bufSize = 2 * ctx.sampleRate;
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 380;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.025;
    noise.connect(filt).connect(noiseGain).connect(master);
    noise.start();

    // fade in
    const t = ctx.currentTime;
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(0.6, t + 2.2);

    nodesRef.current = { master, oscs, noise };
  };

  const stop = () => {
    if (!ctxRef.current || !nodesRef.current) return;
    const ctx = ctxRef.current;
    const t = ctx.currentTime;
    nodesRef.current.master.gain.cancelScheduledValues(t);
    nodesRef.current.master.gain.setValueAtTime(nodesRef.current.master.gain.value, t);
    nodesRef.current.master.gain.linearRampToValueAtTime(0, t + 0.8);
  };

  const toggle = () => {
    if (on) {
      stop();
      setOn(false);
    } else {
      start();
      setOn(true);
    }
  };

  return { on, toggle };
};

Object.assign(window, { FireflyCursor, StarField, Constellation, useAmbientSound });
