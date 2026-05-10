import { cn } from "../ui/cn";

/**
 * DashboardCard — modern stat tile for admin & member dashboards.
 * Gradient icon pill, ambient corner glow, hover lift + icon rotate.
 *
 * Props:
 *  - title, count, icon (JSX element)
 *  - tone  : "primary" | "secondary" | "accent" | "danger" | "info" | "neutral"
 *  - color : legacy override string for the icon pill (kept for back-compat)
 *  - trend : "up" | "down" | "neutral" + trendLabel
 */
const TONES = {
  primary:   { pill: "bg-gradient-to-br from-primary-500 to-primary-600 text-white",     bar: "bg-primary-500",   ring: "ring-primary-100",   label: "text-primary-700"   },
  secondary: { pill: "bg-gradient-to-br from-secondary-500 to-secondary-600 text-white", bar: "bg-secondary-500", ring: "ring-secondary-100", label: "text-secondary-700" },
  accent:    { pill: "bg-gradient-to-br from-accent-500 to-accent-600 text-white",       bar: "bg-accent-500",    ring: "ring-accent-100",    label: "text-accent-700"    },
  danger:    { pill: "bg-gradient-to-br from-danger-500 to-danger-600 text-white",       bar: "bg-danger-500",    ring: "ring-danger-100",    label: "text-danger-700"    },
  info:      { pill: "bg-gradient-to-br from-sky-500 to-sky-600 text-white",              bar: "bg-sky-500",       ring: "ring-sky-100",       label: "text-sky-700"       },
  neutral:   { pill: "bg-gradient-to-br from-gray-500 to-gray-600 text-white",            bar: "bg-gray-500",      ring: "ring-gray-100",      label: "text-gray-700"      },
};

const DashboardCard = ({ title, count, icon, tone = "primary", color, trend = null, trendLabel = "" }) => {
  const t = TONES[tone] || TONES.primary;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[20px] p-5 sm:p-6",
        "bg-white",
        "border border-gray-200",
        "shadow-card transition-all duration-300 ease-out-expo",
        "hover:-translate-y-1.5 hover:shadow-elevated motion-reduce:transform-none"
      )}
    >
      {/* Coloured top accent strip — tone identity without washing the whole card */}
      <span aria-hidden="true" className={cn("absolute top-0 inset-x-0 h-1", t.bar)} />

      <div className="relative flex items-start gap-4 min-w-0">
        <div
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl grid place-items-center shrink-0 ring-4 shadow-card",
            color || t.pill,
            t.ring,
            "transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs sm:text-sm font-semibold uppercase tracking-wide truncate", t.label)}>{title}</p>
          <p className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mt-0.5">
            {count}
          </p>
          {trend && trendLabel && (
            <p
              className={cn(
                "mt-1 text-xs font-semibold",
                trend === "up"      && "text-secondary-700",
                trend === "down"    && "text-danger-700",
                trend === "neutral" && "text-gray-600"
              )}
            >
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} {trendLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
