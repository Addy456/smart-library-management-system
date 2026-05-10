import { cn } from "../ui/cn";

/**
 * FloatingArt — tiny 2.5D-style illustrations built from layered SVG shapes.
 * Deliberately flat-ish + pastel to stay consistent with the design system.
 *
 * variants:
 *   - "books"    → stack of pastel books (dashboards)
 *   - "reading"  → open book with sparkles (empty states / hero)
 *   - "cozy"     → cup + book + star (member hero)
 *   - "search"   → magnifier + book (empty search)
 *   - "rocket"   → rocket (onboarding / start journey)
 *
 * The outer wrapper floats gently; inner accent shapes twinkle.
 * All honour prefers-reduced-motion via `motion-reduce:animate-none`.
 */
const FloatingArt = ({ variant = "books", size = 160, className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative select-none",
        "motion-safe:animate-float-soft motion-reduce:animate-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      {variant === "books" && <Books />}
      {variant === "reading" && <Reading />}
      {variant === "cozy" && <Cozy />}
      {variant === "search" && <Search />}
      {variant === "rocket" && <Rocket />}
    </div>
  );
};

/* ————— variants ————— */

const Books = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
    <defs>
      <linearGradient id="bkPrimary" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#A78BFA" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="bkAccent" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#FCD34D" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="bkSecondary" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#86EFAC" />
        <stop offset="1" stopColor="#22C55E" />
      </linearGradient>
    </defs>

    {/* ground disc */}
    <ellipse cx="100" cy="168" rx="70" ry="10" fill="#0F172A" opacity="0.06" />

    {/* back book (accent) */}
    <g transform="translate(54 60) rotate(-6)">
      <rect width="70" height="92" rx="8" fill="url(#bkAccent)" />
      <rect x="6" y="10" width="58" height="4" rx="2" fill="#fff" opacity="0.5" />
      <rect x="6" y="20" width="40" height="4" rx="2" fill="#fff" opacity="0.35" />
    </g>

    {/* middle book (primary) */}
    <g transform="translate(74 74) rotate(3)">
      <rect width="76" height="80" rx="8" fill="url(#bkPrimary)" />
      <circle cx="22" cy="24" r="6" fill="#fff" opacity="0.7" />
      <rect x="34" y="20" width="30" height="5" rx="2.5" fill="#fff" opacity="0.55" />
      <rect x="12" y="46" width="50" height="4" rx="2" fill="#fff" opacity="0.35" />
    </g>

    {/* front book (secondary) */}
    <g transform="translate(50 108) rotate(-2)">
      <rect width="92" height="44" rx="8" fill="url(#bkSecondary)" />
      <rect x="10" y="12" width="54" height="4" rx="2" fill="#fff" opacity="0.55" />
      <rect x="10" y="22" width="36" height="4" rx="2" fill="#fff" opacity="0.4" />
    </g>

    {/* sparkles */}
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ transformOrigin: "160px 46px" }}>
      <path d="M160 38 L163 46 L171 49 L163 52 L160 60 L157 52 L149 49 L157 46 Z" fill="#F59E0B" />
    </g>
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ animationDelay: "0.7s", transformOrigin: "36px 76px" }}>
      <circle cx="36" cy="76" r="3.5" fill="#8B5CF6" />
    </g>
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ animationDelay: "1.2s", transformOrigin: "176px 120px" }}>
      <circle cx="176" cy="120" r="2.5" fill="#22C55E" />
    </g>
  </svg>
);

const Reading = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
    <defs>
      <linearGradient id="rdPage" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F5F3FF" />
      </linearGradient>
      <linearGradient id="rdSpine" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#A78BFA" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>

    <ellipse cx="100" cy="168" rx="66" ry="9" fill="#0F172A" opacity="0.06" />

    {/* open book */}
    <g transform="translate(28 70)">
      <path d="M0 12 Q72 -8 72 0 L72 82 Q36 72 0 82 Z" fill="url(#rdPage)" stroke="#E9D5FF" />
      <path d="M144 12 Q72 -8 72 0 L72 82 Q108 72 144 82 Z" fill="url(#rdPage)" stroke="#E9D5FF" />
      <path d="M72 0 L72 82" stroke="url(#rdSpine)" strokeWidth="3" strokeLinecap="round" />
      {/* text lines */}
      <rect x="10" y="16" width="48" height="3" rx="1.5" fill="#C4B5FD" />
      <rect x="10" y="26" width="40" height="3" rx="1.5" fill="#DDD6FE" />
      <rect x="10" y="36" width="44" height="3" rx="1.5" fill="#DDD6FE" />
      <rect x="86" y="16" width="48" height="3" rx="1.5" fill="#C4B5FD" />
      <rect x="86" y="26" width="36" height="3" rx="1.5" fill="#DDD6FE" />
      <rect x="86" y="36" width="44" height="3" rx="1.5" fill="#DDD6FE" />
    </g>

    {/* sparkles */}
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ transformOrigin: "40px 50px" }}>
      <path d="M40 40 L43 48 L51 51 L43 54 L40 62 L37 54 L29 51 L37 48 Z" fill="#F59E0B" />
    </g>
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ animationDelay: "0.8s", transformOrigin: "168px 58px" }}>
      <circle cx="168" cy="58" r="4" fill="#22C55E" />
    </g>
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ animationDelay: "1.4s", transformOrigin: "154px 140px" }}>
      <circle cx="154" cy="140" r="3" fill="#8B5CF6" />
    </g>
  </svg>
);

const Cozy = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
    <defs>
      <linearGradient id="czCup" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="czBook" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#A78BFA" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>

    <ellipse cx="100" cy="170" rx="66" ry="9" fill="#0F172A" opacity="0.06" />

    {/* book */}
    <g transform="translate(36 108)">
      <rect width="128" height="46" rx="8" fill="url(#czBook)" />
      <rect x="12" y="12" width="64" height="4" rx="2" fill="#fff" opacity="0.55" />
      <rect x="12" y="22" width="42" height="4" rx="2" fill="#fff" opacity="0.4" />
    </g>

    {/* cup */}
    <g transform="translate(66 40)">
      <path d="M4 10 h60 v40 a18 18 0 0 1 -18 18 h-24 a18 18 0 0 1 -18 -18 Z" fill="url(#czCup)" stroke="#FDE68A" />
      <path d="M64 18 a12 12 0 0 1 0 24" fill="none" stroke="#FDE68A" strokeWidth="4" />
      <ellipse cx="34" cy="14" rx="28" ry="5" fill="#A78BFA" />
      {/* steam */}
      <path d="M20 -2 q4 -8 0 -14" stroke="#C4B5FD" strokeWidth="2" fill="none" strokeLinecap="round" className="motion-safe:animate-float-soft motion-reduce:animate-none" />
      <path d="M34 -2 q4 -8 0 -14" stroke="#C4B5FD" strokeWidth="2" fill="none" strokeLinecap="round" className="motion-safe:animate-float-soft motion-reduce:animate-none" style={{ animationDelay: "0.4s" }} />
      <path d="M48 -2 q4 -8 0 -14" stroke="#C4B5FD" strokeWidth="2" fill="none" strokeLinecap="round" className="motion-safe:animate-float-soft motion-reduce:animate-none" style={{ animationDelay: "0.8s" }} />
    </g>

    {/* star */}
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ transformOrigin: "168px 56px" }}>
      <path d="M168 48 L171 56 L179 59 L171 62 L168 70 L165 62 L157 59 L165 56 Z" fill="#F59E0B" />
    </g>
  </svg>
);

const Search = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
    <defs>
      <linearGradient id="sqBook" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#A78BFA" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="170" rx="66" ry="9" fill="#0F172A" opacity="0.06" />
    <g transform="translate(52 80)">
      <rect width="76" height="60" rx="8" fill="url(#sqBook)" />
      <rect x="10" y="14" width="44" height="4" rx="2" fill="#fff" opacity="0.6" />
      <rect x="10" y="24" width="30" height="4" rx="2" fill="#fff" opacity="0.4" />
    </g>
    <g>
      <circle cx="132" cy="70" r="26" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="5" />
      <line x1="150" y1="88" x2="170" y2="108" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="125" cy="64" r="4" fill="#FCD34D" />
    </g>
  </svg>
);

const Rocket = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
    <defs>
      <linearGradient id="rkBody" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#DDD6FE" />
      </linearGradient>
      <linearGradient id="rkFin" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="170" rx="56" ry="8" fill="#0F172A" opacity="0.06" />
    <g transform="translate(80 30)">
      <path d="M20 0 Q40 40 40 80 L0 80 Q0 40 20 0 Z" fill="url(#rkBody)" stroke="#C4B5FD" />
      <circle cx="20" cy="34" r="7" fill="#8B5CF6" />
      <path d="M0 70 L-14 96 L0 90 Z" fill="url(#rkFin)" />
      <path d="M40 70 L54 96 L40 90 Z" fill="url(#rkFin)" />
      {/* flame */}
      <path d="M10 82 Q20 104 30 82 Q28 96 20 118 Q12 96 10 82 Z" fill="#F59E0B" className="motion-safe:animate-bounce-soft motion-reduce:animate-none" />
    </g>
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ transformOrigin: "40px 48px" }}>
      <circle cx="40" cy="48" r="3" fill="#22C55E" />
    </g>
    <g className="motion-safe:animate-twinkle motion-reduce:animate-none" style={{ animationDelay: "0.7s", transformOrigin: "164px 68px" }}>
      <circle cx="164" cy="68" r="3.5" fill="#8B5CF6" />
    </g>
  </svg>
);

export default FloatingArt;
