/** Decorative 3D-ish arcane grid, orbits and graph lines drawn over the backdrop. */
export function ArcaneOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5] mix-blend-screen"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ao-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ao-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--char-glow)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--char-glow)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* perspective floor grid */}
      <g stroke="url(#ao-fade)" strokeWidth="0.7" fill="none">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`v${i}`} x1={800 + (i - 7) * 46} y1="640" x2={800 + (i - 7) * 300} y2="960" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`h${i}`} x1="0" y1={648 + i * i * 7 + i * 12} x2="1600" y2={648 + i * i * 7 + i * 12} />
        ))}
      </g>

      {/* orbital rings, right side */}
      <g stroke="url(#ao-teal)" fill="none" strokeWidth="0.9">
        <ellipse cx="1160" cy="360" rx="330" ry="96" />
        <ellipse cx="1160" cy="360" rx="270" ry="270" />
        <ellipse cx="1160" cy="360" rx="180" ry="300" transform="rotate(18 1160 360)" />
      </g>
      <g fill="var(--char-glow)" opacity="0.7">
        {[
          [1160, 90],
          [1430, 360],
          [960, 430],
          [1290, 610],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" />
        ))}
      </g>

      {/* left analytic graph lines */}
      <g stroke="var(--gold)" strokeOpacity="0.35" fill="none" strokeWidth="0.8">
        <polyline points="60,820 150,780 240,800 330,720 420,748 510,660" />
        <polyline points="60,868 150,846 240,858 330,812 420,830 510,776" strokeDasharray="4 6" />
        <line x1="60" y1="620" x2="60" y2="880" />
        <line x1="60" y1="880" x2="560" y2="880" />
      </g>
      <g stroke="var(--gold)" strokeOpacity="0.22" strokeWidth="0.6" fill="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`t${i}`} x1={60 + i * 56} y1="880" x2={60 + i * 56} y2="872" />
        ))}
      </g>

      {/* corner reticles */}
      <g stroke="var(--gold)" strokeOpacity="0.4" fill="none" strokeWidth="1">
        <path d="M40 40 H110 M40 40 V110" />
        <path d="M1560 40 H1490 M1560 40 V110" />
        <path d="M40 860 H110 M40 860 V790" />
        <path d="M1560 860 H1490 M1560 860 V790" />
      </g>
    </svg>
  );
}
