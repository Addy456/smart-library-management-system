import { motion } from "framer-motion";
import { cn } from "./cn";

/**
 * PageHero — the bold gradient identity block at the top of every authenticated page.
 *
 * Variants:
 *  - "member"   → indigo → violet → blue (warm, inviting)
 *  - "admin"    → slate → indigo → violet (serious, authoritative)
 *  - "public"   → violet → fuchsia → blue (marketing energy)
 *  - "neutral"  → slate → gray (utility pages: profile, settings)
 *  - "success"  → emerald → teal → cyan (analytics / positive)
 *  - "danger"   → rose → red → orange (alerts / admin reports)
 *
 * Use the eyebrow pill for section context ("YOUR LIBRARY", "ADMIN CONSOLE"…),
 * right-hand `illustration` for a decorative asset, and `actions` for CTAs.
 */
const variants = {
  member:  "from-indigo-700 via-violet-600 to-blue-600",
  admin:   "from-slate-900 via-indigo-800 to-violet-700",
  public:  "from-violet-700 via-fuchsia-600 to-blue-600",
  neutral: "from-slate-700 via-slate-800 to-slate-900",
  success: "from-emerald-600 via-teal-600 to-cyan-600",
  danger:  "from-rose-600 via-red-600 to-orange-500",
};

const PageHero = ({
  variant = "member",
  eyebrow,
  title,
  subtitle,
  badges,
  actions,
  illustration,
  children,
  size = "md",
  className,
}) => {
  const paddingByScale = {
    sm: "p-6 sm:p-8",
    md: "p-8 sm:p-10 lg:p-12",
    lg: "p-10 sm:p-12 lg:p-16",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-[32px] text-white shadow-hero",
        "bg-gradient-to-br",
        variants[variant] || variants.member,
        paddingByScale[size],
        className
      )}
    >
      {/* Decorative glow blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%)]" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-3xl flex-1">
          {(eyebrow || badges) && (
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {eyebrow && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] bg-white/20 text-white border border-white/30 rounded-full px-3.5 py-1.5">
                  {eyebrow}
                </div>
              )}
              {badges}
            </div>
          )}

          {title && (
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-white text-lg sm:text-xl mt-4 max-w-2xl font-medium opacity-95">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-5">{children}</div>}

          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>

        {illustration && (
          <div className="hidden lg:block shrink-0">{illustration}</div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHero;
