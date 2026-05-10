import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

/**
 * AuthCard - a unified shell for login/register/otp/password flows.
 * Features a purple gradient header bar + white/surface body.
 */
const AuthCard = ({
  icon,
  title,
  subtitle,
  children,
  footer,
  accent = "indigo", // indigo | emerald | amber | rose
}) => {
  const gradients = {
    indigo: "from-indigo-700 via-violet-600 to-blue-600",
    emerald: "from-emerald-600 via-teal-600 to-cyan-600",
    amber: "from-amber-500 via-orange-500 to-rose-500",
    rose: "from-rose-600 via-red-600 to-orange-500",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-violet-500/20 dark:bg-violet-500/25 top-1/4 -left-48" />
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-blue-500/20 dark:bg-blue-500/25 bottom-1/4 -right-48" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-[28px] bg-white dark:bg-surface-100 border border-gray-200 dark:border-white/10 shadow-hero overflow-hidden"
      >
        {/* Gradient header */}
        <div className={`relative bg-gradient-to-br ${gradients[accent]} px-6 sm:px-8 pt-8 pb-10 text-center overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border border-white/30 mb-4 shadow-card">
              {icon || <BookOpen className="w-7 h-7 text-white" />}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-white/85 mt-1.5 text-sm sm:text-base">{subtitle}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {children}
          {footer && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
