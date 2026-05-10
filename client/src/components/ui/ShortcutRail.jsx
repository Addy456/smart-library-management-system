import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Section from "./Section";
import { cn } from "./cn";

/**
 * ShortcutRail — the "Jump back in" horizontal rail of task tiles.
 *
 * items: [{ to, title, desc, icon: LucideIcon, tone: "primary|accent|secondary|success|danger|warning|info" }]
 */
const toneStyles = {
  primary:   "from-indigo-500 to-violet-600",
  accent:    "from-fuchsia-500 to-pink-600",
  secondary: "from-emerald-500 to-teal-600",
  success:   "from-emerald-500 to-green-600",
  danger:    "from-rose-500 to-red-600",
  warning:   "from-amber-500 to-orange-600",
  info:      "from-sky-500 to-blue-600",
};

const ShortcutRail = ({
  title = "Jump back in",
  eyebrow = "Shortcuts",
  items = [],
  columns = 3,
  onItemClick,
  className,
}) => {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section
      title={title}
      action={
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {eyebrow}
        </span>
      }
      className={className}
    >
      <div className={cn("grid grid-cols-1 gap-4", gridCols)}>
        {items.map((q, i) => {
          const Icon = q.icon;
          const toneClass = toneStyles[q.tone] || toneStyles.primary;
          const content = (
            <div className="relative flex items-start gap-4">
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl grid place-items-center shrink-0 text-white bg-gradient-to-br shadow-card",
                  "transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6",
                  toneClass
                )}
              >
                {Icon && <Icon className="h-6 w-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">
                  {q.title}
                </h3>
                {q.desc && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{q.desc}</p>
                )}
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 motion-safe:group-hover:translate-x-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all" />
            </div>
          );

          const wrapperClass = cn(
            "group relative overflow-hidden block rounded-2xl p-5",
            "bg-gray-50 dark:bg-surface-200",
            "border border-gray-200 dark:border-white/10",
            "transition-all duration-300",
            "hover:bg-white dark:hover:bg-surface-100 hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-elevated"
          );

          return (
            <motion.div
              key={q.to || q.title || i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onItemClick?.(q)}
            >
              {q.to ? (
                <Link to={q.to} className={wrapperClass}>{content}</Link>
              ) : (
                <button type="button" onClick={q.onClick} className={cn(wrapperClass, "w-full text-left")}>
                  {content}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default ShortcutRail;
