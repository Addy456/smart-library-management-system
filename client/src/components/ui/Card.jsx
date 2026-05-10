import { forwardRef } from "react";
import { cn } from "./cn";

/**
 * Card — Smart Library design system primitive
 *
 * variant:
 *  - "default"  : solid surface, hairline border, subtle shadow
 *  - "glass"    : translucent + backdrop blur (works over gradients)
 *  - "elevated" : raised shadow, no border — good for feature tiles
 *
 * padding: "none" | "sm" | "md" | "lg"   (default "md")
 * interactive: boolean → adds hover lift + cursor-pointer
 */

const base =
  "rounded-3xl transition-all duration-200 " +
  "text-gray-800 dark:text-gray-100";

const variants = {
  default:
    "bg-white dark:bg-surface-200 " +
    "border border-gray-200/80 dark:border-white/10 " +
    "shadow-card",
  glass:
    "bg-white/70 dark:bg-white/5 " +
    "backdrop-blur-xl " +
    "border border-white/60 dark:border-white/10 " +
    "shadow-card",
  elevated:
    "bg-white dark:bg-surface-200 " +
    "border border-transparent " +
    "shadow-elevated",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef(function Card(
  {
    variant = "default",
    padding = "md",
    interactive = false,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        base,
        variants[variant],
        paddings[padding],
        interactive &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated motion-reduce:transform-none",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

/* Optional sub-parts for consistent composition */

export const CardHeader = ({ className, ...rest }) => (
  <div className={cn("mb-4 flex items-start justify-between gap-3", className)} {...rest} />
);

export const CardTitle = ({ className, ...rest }) => (
  <h3
    className={cn(
      "font-heading text-lg font-bold tracking-tight text-gray-900 dark:text-white",
      className
    )}
    {...rest}
  />
);

export const CardDescription = ({ className, ...rest }) => (
  <p
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...rest}
  />
);

export const CardFooter = ({ className, ...rest }) => (
  <div className={cn("mt-6 flex items-center gap-3", className)} {...rest} />
);

export default Card;
