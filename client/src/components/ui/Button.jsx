import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

/**
 * Button — Smart Library design system primitive
 *
 * Props:
 *  - variant : "primary" | "secondary" | "ghost" | "danger"   (default: "primary")
 *  - size    : "sm" | "md" | "lg"                             (default: "md")
 *  - loading : boolean                                        (shows spinner, disables)
 *  - leftIcon / rightIcon : lucide-react icon component
 *  - fullWidth : boolean
 *  - as      : render as another element (e.g. Link) — pass a component
 *
 * Accessibility:
 *  - focus-visible ring on every variant
 *  - aria-busy when loading
 *  - respects prefers-reduced-motion (no transform on tap)
 */

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl " +
  "transition-all duration-200 select-none " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background dark:focus-visible:ring-offset-surface-100 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card " +
  "motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97]";

const variants = {
  primary:
    "bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700 " +
    "focus-visible:ring-primary-500",
  secondary:
    "bg-secondary-500 text-white shadow-sm hover:bg-secondary-600 active:bg-secondary-700 " +
    "focus-visible:ring-secondary-500",
  ghost:
    "bg-transparent text-gray-700 dark:text-gray-200 " +
    "hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200 dark:active:bg-white/10 " +
    "focus-visible:ring-primary-500",
  danger:
    "bg-danger-500 text-white shadow-sm hover:bg-danger-600 active:bg-danger-700 " +
    "focus-visible:ring-danger-500",
};

const sizes = {
  sm: "h-9 px-3 text-sm [&_svg]:h-4 [&_svg]:w-4",
  md: "h-11 px-5 text-sm [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-12 px-6 text-base [&_svg]:h-5 [&_svg]:w-5",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    as: Component = "button",
    className,
    disabled,
    children,
    ...rest
  },
  ref
) {
  const isButton = Component === "button";
  return (
    <Component
      ref={ref}
      type={isButton ? rest.type || "button" : undefined}
      disabled={isButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon aria-hidden="true" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon aria-hidden="true" />}
    </Component>
  );
});

export default Button;
