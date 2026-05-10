import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, Zap, BookOpen, Target, Sparkles, Lock } from "lucide-react";
import { cn } from "../ui/cn";

/* ─────────────────────────────────────────────────────────────────── *
 * Gamification primitives — Duolingo-style progress, streak, badges.  *
 *                                                                     *
 * All derived from the reader's stats so nothing is fake:              *
 *   - streak          : consecutive days with a borrow/return event    *
 *   - xp              : 20 XP per returned book + 5 XP per active one  *
 *   - level           : floor(xp / 100) + 1                            *
 *   - progressInLevel : xp % 100                                       *
 *                                                                     *
 * Exports: useGameStats (hook), StreakBadge, XPBar, AchievementsGrid. *
 * ─────────────────────────────────────────────────────────────────── */

/** Compute reader game stats from borrow history. Memoised by caller. */
export const useGameStats = (records = []) => {
  return useMemo(() => {
    const returned = records.filter((r) => r.status === "returned");
    const active   = records.filter((r) => r.status === "borrowed");

    // Streak: count distinct days with any activity, working backwards from today.
    const daySet = new Set(
      records
        .map((r) => r.updatedAt || r.createdAt || r.borrowDate)
        .filter(Boolean)
        .map((d) => new Date(d).toISOString().slice(0, 10))
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (daySet.has(key)) streak += 1;
      else if (i > 0) break;            // allow today to be empty, break on first gap
    }

    const xp               = returned.length * 20 + active.length * 5;
    const level            = Math.floor(xp / 100) + 1;
    const xpInLevel        = xp % 100;
    const xpToNext         = 100 - xpInLevel;

    return {
      streak,
      xp,
      level,
      xpInLevel,
      xpToNext,
      progress: xpInLevel,              // 0–100
      returnedCount: returned.length,
      activeCount: active.length,
    };
  }, [records]);
};

/* ─────────── Streak badge ─────────── */

export const StreakBadge = ({ streak = 0, className = "" }) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-2xl px-3.5 py-2",
      "bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-card",
      "motion-safe:animate-bounce-soft motion-reduce:animate-none",
      className
    )}
    aria-label={`${streak} day streak`}
  >
    <Flame className="h-5 w-5 drop-shadow" />
    <div className="leading-none">
      <div className="text-lg font-bold">{streak}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/85 font-semibold">
        day streak
      </div>
    </div>
  </div>
);

/* ─────────── XP bar ─────────── */

export const XPBar = ({ level, xpInLevel, xpToNext, variant = "on-hero" }) => {
  const onHero = variant === "on-hero";
  return (
    <div
      className={cn(
        "w-full max-w-md",
        onHero ? "text-white" : "text-gray-900"
      )}
    >
      <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <Star className={cn("h-3.5 w-3.5", onHero ? "text-accent-300" : "text-accent-500")} fill="currentColor" />
          Level {level}
        </span>
        <span className={cn("font-semibold", onHero ? "text-white/90" : "text-gray-600")}>
          {xpToNext} XP to Level {level + 1}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={xpInLevel}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "relative h-3 w-full rounded-full overflow-hidden",
          onHero ? "bg-white/20" : "bg-gray-100 border border-gray-200"
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${xpInLevel}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className={cn(
            "h-full rounded-full relative",
            "bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500"
          )}
        >
          {/* glossy highlight */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-full" />
        </motion.div>
      </div>
    </div>
  );
};

/* ─────────── Achievements ─────────── */

/**
 * Built-in achievement catalogue. Each tests against stats and returns unlocked.
 * Keep the list short & motivational — the emotional hook of gamification.
 */
const BADGE_DEFS = [
  { id: "first-book",   title: "First Page",     desc: "Borrow your first book",    icon: BookOpen, tone: "primary",   test: (s) => s.returnedCount + s.activeCount >= 1 },
  { id: "bookworm",     title: "Bookworm",       desc: "Return 5 books",            icon: Trophy,   tone: "accent",    test: (s) => s.returnedCount >= 5 },
  { id: "streak-3",     title: "On Fire",        desc: "3-day streak",              icon: Flame,    tone: "danger",    test: (s) => s.streak >= 3 },
  { id: "level-up",     title: "Level Up",       desc: "Reach Level 2",             icon: Zap,      tone: "secondary", test: (s) => s.level >= 2 },
  { id: "marathoner",   title: "Marathoner",     desc: "Return 10 books",           icon: Target,   tone: "primary",   test: (s) => s.returnedCount >= 10 },
  { id: "star-reader",  title: "Star Reader",    desc: "Earn 250 XP",               icon: Sparkles, tone: "accent",    test: (s) => s.xp >= 250 },
];

const TONE_STYLES = {
  primary:   { unlocked: "bg-gradient-to-br from-primary-400 to-primary-600 text-white",   ring: "ring-primary-100"   },
  secondary: { unlocked: "bg-gradient-to-br from-secondary-400 to-secondary-600 text-white", ring: "ring-secondary-100" },
  accent:    { unlocked: "bg-gradient-to-br from-accent-400 to-accent-600 text-white",     ring: "ring-accent-100"    },
  danger:    { unlocked: "bg-gradient-to-br from-danger-400 to-danger-600 text-white",     ring: "ring-danger-100"    },
};

export const AchievementsGrid = ({ stats }) => {
  const items = BADGE_DEFS.map((b) => ({ ...b, unlocked: b.test(stats) }));
  const unlockedCount = items.filter((i) => i.unlocked).length;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] p-5 sm:p-6",
        "bg-white border border-gray-100 shadow-card"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent-500" /> Achievements
        </h3>
        <span className="text-xs font-semibold text-gray-700">
          {unlockedCount} / {items.length} unlocked
        </span>
      </div>

      <ul className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {items.map((b, i) => {
          const styles = TONE_STYLES[b.tone] || TONE_STYLES.primary;
          const Icon = b.icon;
          return (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col items-center text-center"
            >
              <div
                className={cn(
                  "relative h-14 w-14 rounded-2xl grid place-items-center ring-4 transition-transform duration-300",
                  "motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110",
                  b.unlocked
                    ? cn(styles.unlocked, styles.ring, "shadow-card")
                    : "bg-gray-100 text-gray-400 ring-gray-50"
                )}
                aria-label={b.unlocked ? `${b.title} unlocked` : `${b.title} locked`}
                title={b.desc}
              >
                {b.unlocked ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                {b.unlocked && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary-500 ring-2 ring-white motion-safe:animate-twinkle motion-reduce:animate-none" />
                )}
              </div>
              <p className={cn(
                "mt-2 text-[11px] font-semibold leading-tight",
                b.unlocked ? "text-gray-900" : "text-gray-500"
              )}>
                {b.title}
              </p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};
