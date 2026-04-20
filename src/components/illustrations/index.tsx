/**
 * Custom SVG illustrations — brand-colored, used for empty states and onboarding.
 * Not Lucide icons. Each is ~128×128 unless noted, and inherits currentColor via
 * CSS vars. Purely presentational; mark `aria-hidden` at call site.
 */

export function BellIllustration({ size = 128 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="bell-body" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--accent-pressed)" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="bell-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="64" cy="58" r="52" fill="url(#bell-glow)" />

      {/* Soundwaves — thin arcs */}
      <path
        d="M 28 54 Q 22 64 28 74"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 100 54 Q 106 64 100 74"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 18 46 Q 8 64 18 82"
        stroke="var(--accent)"
        strokeOpacity="0.18"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 110 46 Q 120 64 110 82"
        stroke="var(--accent)"
        strokeOpacity="0.18"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Bell body */}
      <path
        d="M 64 28 Q 44 28 42 54 L 40 72 Q 38 78 34 82 L 94 82 Q 90 78 88 72 L 86 54 Q 84 28 64 28 Z"
        fill="url(#bell-body)"
        stroke="var(--accent)"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      {/* Top knob */}
      <circle cx="64" cy="24" r="4" fill="var(--accent-hover)" />
      {/* Clapper */}
      <path
        d="M 60 88 Q 64 96 68 88"
        stroke="var(--accent-pressed)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="64" cy="92" r="3.5" fill="var(--accent-pressed)" />

      {/* Highlight stroke */}
      <path
        d="M 54 40 Q 48 48 47 60"
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FoldersIllustration({ size = 128 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="folder-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent-pressed)" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="folder-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-hover)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="folder-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="64" cy="60" r="52" fill="url(#folder-glow)" />

      {/* Back folder */}
      <g transform="translate(8, 8) rotate(-6 56 56)">
        <path
          d="M 12 28 L 28 28 L 34 24 L 56 24 Q 62 24 62 30 L 62 72 Q 62 78 56 78 L 18 78 Q 12 78 12 72 Z"
          fill="url(#folder-back)"
          stroke="var(--accent-hover)"
          strokeOpacity="0.45"
          strokeWidth="0.75"
        />
      </g>

      {/* Middle folder */}
      <g transform="translate(22, 18) rotate(3 56 56)">
        <path
          d="M 12 28 L 28 28 L 34 24 L 56 24 Q 62 24 62 30 L 62 72 Q 62 78 56 78 L 18 78 Q 12 78 12 72 Z"
          fill="url(#folder-front)"
          stroke="var(--accent)"
          strokeOpacity="0.6"
          strokeWidth="0.75"
        />
        <line
          x1="20"
          y1="44"
          x2="52"
          y2="44"
          stroke="white"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <line
          x1="20"
          y1="52"
          x2="44"
          y2="52"
          stroke="white"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      </g>

      {/* Front folder, empty (dashed tab) */}
      <g transform="translate(36, 30)">
        <path
          d="M 8 16 L 22 16 L 26 12 L 46 12 Q 52 12 52 18 L 52 58 Q 52 64 46 64 L 14 64 Q 8 64 8 58 Z"
          fill="var(--bg-raised)"
          stroke="var(--accent)"
          strokeOpacity="0.6"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <circle cx="30" cy="38" r="6" fill="var(--accent)" fillOpacity="0.15" />
        <path
          d="M 30 35 L 30 41 M 27 38 L 33 38"
          stroke="var(--accent)"
          strokeOpacity="0.75"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function SearchIllustration({ size = 128 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="glass-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--accent-pressed)" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="search-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="64" cy="60" r="52" fill="url(#search-glow)" />

      {/* Rows of bricks in the background */}
      <g opacity="0.5">
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(14, ${26 + row * 16})`}>
            {[0, 1, 2, 3, 4, 5].map((col) => (
              <rect
                key={col}
                x={col * 16}
                y={0}
                width={14}
                height={10}
                rx={1.5}
                fill="var(--bg-overlay)"
                stroke="var(--border-emphasis)"
                strokeWidth="0.75"
              />
            ))}
          </g>
        ))}
      </g>

      {/* Magnifier */}
      <g transform="translate(44, 34) rotate(-14 28 28)">
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="var(--bg-base)"
          fillOpacity="0.85"
          stroke="url(#glass-rim)"
          strokeWidth="3"
        />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
        {/* Highlight arc */}
        <path
          d="M 14 20 Q 16 14 24 12"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Handle */}
        <rect
          x="46"
          y="44"
          width="6"
          height="22"
          rx="3"
          fill="url(#glass-rim)"
          transform="rotate(42 49 55)"
        />
      </g>
    </svg>
  );
}
