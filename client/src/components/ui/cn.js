/**
 * Class name merger — small utility so primitives can accept extra classes
 * from callers without conflicts. No external deps required.
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-primary-500", className)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
