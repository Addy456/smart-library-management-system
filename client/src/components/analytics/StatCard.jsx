import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../ui/cn";

/**
 * StatCard — analytics tile with optional trend indicator.
 * Matches DashboardCard language (gradient pill, ambient glow, hover lift).
 * trend: "up" | "down" | "neutral" | null
 */
const StatCard = ({ icon, label, value, color, trend = null, trendLabel = "" }) => (
  <div
    className={cn(
      "group relative overflow-hidden rounded-[20px] p-5 sm:p-6",
      "bg-white",
      "border border-gray-200",
      "shadow-card transition-all duration-300 ease-out-expo",
      "hover:-translate-y-1.5 hover:shadow-elevated motion-reduce:transform-none"
    )}
  >
    <div className="relative flex items-start gap-4">
      <div
        className={cn(
          "h-12 w-12 rounded-2xl grid place-items-center text-lg flex-shrink-0 ring-4 ring-gray-50 shadow-card",
          color,
          "transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{value}</p>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1 text-xs font-semibold",
              trend === "up"      && "text-secondary-600",
              trend === "down"    && "text-danger-600",
              trend === "neutral" && "text-gray-400"
            )}
          >
            {trend === "up"      && <TrendingUp className="w-3 h-3" />}
            {trend === "down"    && <TrendingDown className="w-3 h-3" />}
            {trend === "neutral" && <Minus className="w-3 h-3" />}
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StatCard;
