import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FloatingArt from "./FloatingArt";
import { Button } from "../ui";
import { cn } from "../ui/cn";

/**
 * EmptyState — friendly, illustrated placeholder.
 *
 * Props:
 *  - icon (optional)    : lucide icon; shown as small chip above the title
 *  - illustration       : FloatingArt variant ("books" | "reading" | "cozy" | "search" | "rocket")
 *  - title              : headline (short, warm)
 *  - description        : one-line helper copy
 *  - actionLabel        : CTA label
 *  - actionTo | onAction: CTA target (Link or callback)
 *  - tone               : "primary" | "secondary" | "accent" (tints the CTA + chip)
 */
const EmptyState = ({
  icon: Icon,
  illustration = "reading",
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  tone = "primary",
  className = "",
}) => {
  const chip = {
    primary:   "bg-primary-50 text-primary-700 border-primary-100",
    secondary: "bg-secondary-50 text-secondary-700 border-secondary-100",
    accent:    "bg-accent-50 text-accent-700 border-accent-100",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-10 sm:py-14 px-4",
        className
      )}
    >
      <FloatingArt variant={illustration} size={172} className="mb-4" />

      {Icon && (
        <div className={cn("inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider border rounded-full px-2.5 py-1 mb-3", chip)}>
          <Icon className="w-3.5 h-3.5" />
          <span>Nothing here yet</span>
        </div>
      )}

      <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>

      {actionLabel && actionTo && (
        <Button as={Link} to={actionTo} variant={tone === "primary" ? "primary" : tone === "secondary" ? "secondary" : "accent"} size="md">
          {actionLabel}
        </Button>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button onClick={onAction} variant={tone === "primary" ? "primary" : tone === "secondary" ? "secondary" : "accent"} size="md">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
