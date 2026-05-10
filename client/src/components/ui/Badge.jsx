import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "./cn";

/**
 * Badge — status pill for the Smart Library design system.
 *
 * tone : "success" | "warning" | "danger" | "info" | "neutral"
 * size : "sm" | "md"
 * icon : boolean (default true)  — show the default tone icon
 * dot  : boolean                  — show a leading colored dot instead of icon
 * as   : "span" | "button"        — render as interactive pill
 */

const tones = {
  success: {
    cls:
      "bg-secondary-50 text-secondary-700 border-secondary-200 " +
      "dark:bg-secondary-500/10 dark:text-secondary-400 dark:border-secondary-500/20",
    dot: "bg-secondary-500",
    icon: CheckCircle2,
  },
  warning: {
    cls:
      "bg-accent-50 text-accent-700 border-accent-200 " +
      "dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500/20",
    dot: "bg-accent-500",
    icon: AlertTriangle,
  },
  danger: {
    cls:
      "bg-danger-50 text-danger-700 border-danger-200 " +
      "dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20",
    dot: "bg-danger-500",
    icon: XCircle,
  },
  info: {
    cls:
      "bg-primary-50 text-primary-700 border-primary-200 " +
      "dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20",
    dot: "bg-primary-500",
    icon: Info,
  },
  neutral: {
    cls:
      "bg-gray-100 text-gray-700 border-gray-200 " +
      "dark:bg-white/5 dark:text-gray-300 dark:border-white/10",
    dot: "bg-gray-400",
    icon: Info,
  },
};

const sizes = {
  sm: "text-[11px] px-2 py-0.5 gap-1 [&_svg]:h-3 [&_svg]:w-3",
  md: "text-xs px-2.5 py-1 gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5",
};

const Badge = ({
  tone = "neutral",
  size = "md",
  icon = true,
  dot = false,
  as: Component = "span",
  className,
  children,
  ...rest
}) => {
  const t = tones[tone];
  const Icon = t.icon;

  return (
    <Component
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        t.cls,
        sizes[size],
        className
      )}
      {...rest}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("inline-block h-1.5 w-1.5 rounded-full", t.dot)}
        />
      ) : icon ? (
        <Icon aria-hidden="true" />
      ) : null}
      {children}
    </Component>
  );
};

export default Badge;
