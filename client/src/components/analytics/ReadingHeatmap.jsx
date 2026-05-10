import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStreakCalendar } from "../../redux/slices/analyticsSlice";

const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Convert JS getDay() (0=Sun) to Monday-based index (0=Mon)
const toMondayIndex = (jsDay) => (jsDay + 6) % 7;

/**
 * GitHub-style 52×7 CSS grid heatmap.
 * Each cell = one day, color intensity based on daily borrow count.
 */
const ReadingHeatmap = () => {
  const dispatch = useDispatch();
  const { calendar } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchStreakCalendar());
  }, [dispatch]);

  // Compute the intensity color for a count value
  const maxCount = useMemo(
    () => Math.max(...calendar.map((d) => d.count), 1),
    [calendar]
  );

  const getColor = (count) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-indigo-200";
    if (ratio <= 0.5) return "bg-indigo-300";
    if (ratio <= 0.75) return "bg-indigo-500";
    return "bg-indigo-700";
  };

  // Group calendar into weeks (columns of 7)
  const weeks = useMemo(() => {
    if (!calendar.length) return [];
    const result = [];
    // Pad the beginning so the first day aligns to correct weekday (Monday-based)
    const firstDayOfWeek = toMondayIndex(new Date(calendar[0]?.date).getDay());
    const padded = [...Array(firstDayOfWeek).fill(null), ...calendar];
    for (let i = 0; i < padded.length; i += 7) {
      result.push(padded.slice(i, i + 7));
    }
    return result;
  }, [calendar]);

  // Month labels
  const monthLabels = useMemo(() => {
    if (!calendar.length) return [];
    const labels = [];
    let lastMonth = -1;
    const firstDayOfWeek = toMondayIndex(new Date(calendar[0]?.date).getDay());
    let dayIndex = 0;

    for (const day of calendar) {
      const d = new Date(day.date);
      const month = d.getMonth();
      const currentWeekIndex = Math.floor((dayIndex + firstDayOfWeek) / 7);
      if (month !== lastMonth) {
        labels.push({
          label: d.toLocaleString("default", { month: "short" }),
          weekIndex: currentWeekIndex,
        });
        lastMonth = month;
      }
      dayIndex++;
    }
    return labels;
  }, [calendar]);

  if (!calendar.length) {
    return (
      <p className="text-gray-400 text-sm italic text-center py-8">
        No activity data yet — start borrowing books!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Month labels row */}
      <div className="flex mb-1 ml-8">
        {monthLabels.map((m, i) => (
          <div
            key={i}
            className="text-[10px] text-gray-400"
            style={{
              position: "relative",
              left: `${m.weekIndex * 15}px`,
              marginRight: i < monthLabels.length - 1
                ? `${((monthLabels[i + 1]?.weekIndex || 0) - m.weekIndex) * 15 - 30}px`
                : 0,
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {DAYS.map((d, i) => (
            <div
              key={i}
              className="text-[10px] text-gray-400 h-[13px] flex items-center justify-end pr-0.5"
              style={{ width: "24px" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5 overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                if (!day) {
                  return (
                    <div
                      key={di}
                      className="w-[13px] h-[13px] rounded-sm"
                    />
                  );
                }
                return (
                  <div
                    key={di}
                    className={`w-[13px] h-[13px] rounded-sm ${getColor(
                      day.count
                    )} transition-colors cursor-default`}
                    title={`${day.date}: ${day.count} borrow${
                      day.count !== 1 ? "s" : ""
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-[10px] text-gray-400">Less</span>
        <div className="w-[13px] h-[13px] rounded-sm bg-gray-100 dark:bg-gray-800" />
        <div className="w-[13px] h-[13px] rounded-sm bg-indigo-200 dark:bg-indigo-200" />
        <div className="w-[13px] h-[13px] rounded-sm bg-indigo-300" />
        <div className="w-[13px] h-[13px] rounded-sm bg-indigo-500" />
        <div className="w-[13px] h-[13px] rounded-sm bg-indigo-700" />
        <span className="text-[10px] text-gray-400">More</span>
      </div>
    </div>
  );
};

export default ReadingHeatmap;
