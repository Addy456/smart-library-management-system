import { cn } from "./cn";

/**
 * Section — white container with optional coloured top accent strip.
 * The workhorse of every non-hero block in the app.
 *
 * Props:
 *  - title / eyebrow / description / action → standard header layout
 *  - accent: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "none"
 *  - padding: "sm" | "md" | "lg"
 *  - as: element tag (default "section")
 */
const accents = {
  primary:   "from-indigo-500 via-violet-500 to-blue-500",
  secondary: "from-emerald-500 via-teal-500 to-cyan-500",
  success:   "from-emerald-500 via-green-500 to-lime-500",
  danger:    "from-rose-500 via-red-500 to-orange-500",
  warning:   "from-amber-500 via-orange-500 to-yellow-500",
  info:      "from-sky-500 via-blue-500 to-indigo-500",
  accent:    "from-fuchsia-500 via-pink-500 to-rose-500",
  none:      null,
};

const paddings = {
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const Section = ({
  as: Tag = "section",
  title,
  eyebrow,
  description,
  action,
  accent = "none",
  padding = "md",
  headerClassName,
  bodyClassName,
  className,
  children,
}) => {
  const accentGradient = accents[accent];
  const hasHeader = title || eyebrow || description || action;

  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-[24px]",
        "bg-white dark:bg-surface-100",
        "border border-gray-200 dark:border-white/10",
        "shadow-card",
        className
      )}
    >
      {accentGradient && (
        <div
          aria-hidden
          className={cn(
            "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r",
            accentGradient
          )}
        />
      )}

      <div className={cn(paddings[padding], accentGradient && "pt-[calc(theme(spacing.5)+2px)] sm:pt-[calc(theme(spacing.6)+2px)]")}>
        {hasHeader && (
          <div className={cn("flex items-start justify-between gap-4 mb-4", headerClassName)}>
            <div className="min-w-0">
              {eyebrow && (
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 mb-1">
                  {eyebrow}
                </div>
              )}
              {title && (
                <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        <div className={bodyClassName}>{children}</div>
      </div>
    </Tag>
  );
};

export default Section;
