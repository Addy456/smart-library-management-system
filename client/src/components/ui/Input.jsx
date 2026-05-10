import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "./cn";

/**
 * Input — Smart Library design system primitive.
 *
 * Props:
 *  - label       : string
 *  - hint        : string (shown when no error)
 *  - error       : string
 *  - leftIcon    : lucide-react icon component
 *  - rightIcon   : lucide-react icon component (ignored for type="password")
 *  - type        : HTML input type; "password" auto-adds reveal toggle
 *  - size        : "md" | "lg"           (default "md")
 *  - fullWidth   : boolean                (default true)
 *
 * Accessibility:
 *  - label + input linked via generated id
 *  - aria-invalid + aria-describedby for error / hint
 */

const baseField =
  "w-full rounded-2xl border bg-white dark:bg-surface-200 " +
  "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 " +
  "transition-colors duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-0 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const okState =
  "border-gray-300 dark:border-white/10 " +
  "hover:border-gray-400 dark:hover:border-white/20 " +
  "focus:border-primary-500 focus:ring-primary-500/30";

const errState =
  "border-danger-500 " +
  "focus:border-danger-500 focus:ring-danger-500/30";

const sizes = {
  md: "h-11 text-sm",
  lg: "h-12 text-base",
};

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    type = "text",
    size = "md",
    fullWidth = true,
    className,
    id,
    ...rest
  },
  ref
) {
  const reactId = useId();
  const inputId = id || `fld-${reactId}`;
  const describedBy = error
    ? `${inputId}-err`
    : hint
    ? `${inputId}-hint`
    : undefined;

  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (revealed ? "text" : "password") : type;

  return (
    <div className={cn(fullWidth && "w-full", !fullWidth && "inline-block")}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          />
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            baseField,
            sizes[size],
            error ? errState : okState,
            LeftIcon && "pl-10",
            (isPassword || RightIcon) && "pr-10",
            "px-4",
            className
          )}
          {...rest}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : RightIcon ? (
          <RightIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          />
        ) : null}
      </div>

      {error ? (
        <p
          id={`${inputId}-err`}
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger-600 dark:text-danger-400"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
