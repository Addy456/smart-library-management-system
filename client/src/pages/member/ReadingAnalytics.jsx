import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyStats, fetchTopAuthors } from "../../redux/slices/analyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import PageSkeleton from "../../components/common/PageSkeleton";
import StatCard from "../../components/analytics/StatCard";
import ReadingHeatmap from "../../components/analytics/ReadingHeatmap";
import { PageHero, Section } from "../../components/ui";

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#7c3aed",
];

const ReadingAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, topAuthors, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchMyStats());
    dispatch(fetchTopAuthors());
  }, [dispatch]);

  if (loading) return <PageSkeleton variant="dashboard" />;

  if (error) {
    return (
      <div className="rounded-[24px] p-10 bg-white dark:bg-surface-100 border border-gray-200 dark:border-white/10 shadow-card text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // Compute trend for total borrowed (compare last 2 months)
  const lastMonth = stats.booksPerMonth?.[stats.booksPerMonth.length - 1]?.count || 0;
  const prevMonth = stats.booksPerMonth?.[stats.booksPerMonth.length - 2]?.count || 0;
  const borrowTrend = lastMonth > prevMonth ? "up" : lastMonth < prevMonth ? "down" : "neutral";
  const borrowTrendLabel = lastMonth > prevMonth
    ? `+${lastMonth - prevMonth} vs last month`
    : lastMonth < prevMonth
    ? `${lastMonth - prevMonth} vs last month`
    : "Same as last month";

  const statCards = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Total Books Borrowed",
      value: stats.totalBorrowed,
      color: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
      trend: borrowTrend,
      trendLabel: borrowTrendLabel,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Books Returned",
      value: stats.totalReturned,
      color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "On-Time Return Rate",
      value: `${stats.onTimeRate}%`,
      color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      trend: stats.onTimeRate >= 80 ? "up" : stats.onTimeRate >= 50 ? "neutral" : "down",
      trendLabel: stats.onTimeRate >= 80 ? "Great!" : stats.onTimeRate >= 50 ? "Room to improve" : "Needs attention",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Reading Streak (months)",
      value: stats.readingStreak,
      color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      trend: stats.readingStreak > 0 ? "up" : "neutral",
      trendLabel: stats.readingStreak > 0 ? `${stats.readingStreak} consecutive` : "Start a streak!",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHero
        variant="success"
        size="sm"
        eyebrow={<><TrendingUp className="h-3.5 w-3.5" /> Reading insights</>}
        title={<>Your reading story 📊</>}
        subtitle={
          stats.favouriteCategory ? (
            <>Insights into your reading journey · Favourite category: <strong className="font-bold">{stats.favouriteCategory}</strong></>
          ) : "Insights into your reading journey"
        }
        badges={
          stats.readingStreak > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
              🔥 {stats.readingStreak} mo streak
            </div>
          )
        }
      />

      <Section accent="primary" title="Key stats" eyebrow="This year">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </Section>

      {stats.totalFines > 0 && (
        <div className="rounded-[24px] p-5 bg-white dark:bg-surface-100 border-2 border-rose-300 dark:border-rose-500/40 flex items-start gap-4 shadow-card">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white grid place-items-center shrink-0 shadow-card">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-rose-700 dark:text-rose-300">
              Total fines accrued: ₹{stats.totalFines}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              Return books on time to avoid fines!
            </p>
          </div>
        </div>
      )}

      <Section accent="info" title="Reading activity" description="Your 365-day reading heatmap">
        <ReadingHeatmap />
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section accent="primary" title="Books returned per month">
          {stats.booksPerMonth.some((m) => m.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.booksPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} interval={"preserveStartEnd"} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center py-12">
              No data yet — start borrowing books!
            </p>
          )}
        </Section>

        <Section accent="accent" title="Reading by category">
          {stats.categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => {
                    if (typeof window !== 'undefined' && window.innerWidth < 640) return `${(percent * 100).toFixed(0)}%`;
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  labelLine={false}
                >
                  {stats.categoryDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "#64748b", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center py-12">
              No category data yet.
            </p>
          )}
        </Section>
      </div>

      {topAuthors.length > 0 && (
        <Section
          accent="warning"
          title={<span className="inline-flex items-center gap-2"><User className="w-5 h-5 text-amber-500" /> Your top authors</span>}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {topAuthors.map((author, i) => (
              <div
                key={i}
                className="rounded-2xl p-3 text-center bg-gray-50 dark:bg-surface-200 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-surface-100 hover:border-indigo-200 dark:hover:border-indigo-500/40 transition-all"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center font-bold text-sm mb-2 shadow-card">
                  {author.name?.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {author.count} book{author.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {stats.recentActivity.length > 0 && (
        <Section accent="secondary" title="Recent activity">
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
                  <th className="pb-3 pr-4">Book</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Issued</th>
                  <th className="pb-3 pr-4">Due</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {stats.recentActivity.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white max-w-[180px] truncate">
                      {a.bookTitle}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{a.category}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      {new Date(a.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      {new Date(a.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          a.status === "returned"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                            : new Date(a.returnDate) < new Date()
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                            : "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30"
                        }`}
                      >
                        {a.status === "returned"
                          ? "Returned"
                          : new Date(a.returnDate) < new Date()
                          ? "Overdue"
                          : "Active"}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {a.fine > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">₹{a.fine}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
};

export default ReadingAnalytics;
