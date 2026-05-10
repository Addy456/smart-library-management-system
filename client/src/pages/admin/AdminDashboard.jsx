import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { fetchUsersIfNeeded } from "../../redux/slices/userSlice";
import { fetchAllRecordsIfNeeded, fetchOverdueIfNeeded } from "../../redux/slices/borrowSlice";
import DashboardCard from "../../components/common/DashboardCard";
import FloatingArt from "../../components/common/FloatingArt";
import { Badge, Button, Card, CardHeader, CardTitle } from "../../components/ui";
import { BookOpen, Users, FileText, AlertCircle, Plus, ClipboardList, BarChart2, Sparkles } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { totalBooks, books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);
  const { records, overdueRecords } = useSelector((state) => state.borrow);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllBooks({}));
    dispatch(fetchUsersIfNeeded());
    dispatch(fetchAllRecordsIfNeeded());
    dispatch(fetchOverdueIfNeeded());
  }, [dispatch]);

  const { issuedBooks, pendingRequests } = useMemo(() => ({
    issuedBooks: records.filter((r) => r.status === "borrowed").length,
    pendingRequests: records.filter((r) => r.status === "pending").length,
  }), [records]);

  const stats = [
    { title: "Total Books",      count: totalBooks || books.length, icon: <BookOpen className="w-6 h-6" />,   tone: "primary"   },
    { title: "Total Members",    count: users.length,               icon: <Users className="w-6 h-6" />,      tone: "secondary" },
    { title: "Pending Requests", count: pendingRequests,            icon: <FileText className="w-6 h-6" />,   tone: "accent"    },
    { title: "Books Issued",     count: issuedBooks,                icon: <FileText className="w-6 h-6" />,   tone: "info"      },
    { title: "Overdue Books",    count: overdueRecords.length,      icon: <AlertCircle className="w-6 h-6" />,tone: "danger"    },
  ];

  const recentActivity = records.slice(0, 5);

  const statusToTone = (s) =>
    s === "borrowed" ? "info"
    : s === "returned" ? "success"
    : s === "pending"  ? "warning"
    : s === "rejected" ? "danger"
    : "neutral";

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* HERO — bold indigo/violet/blue, the page’s visual anchor */}
      <div className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white shadow-hero">
        {/* decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-24 h-56 w-56 rounded-full bg-accent-400/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%)]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] bg-white/20 text-white border border-white/30 rounded-full px-3.5 py-1.5 mb-5">
              <Sparkles className="h-3.5 w-3.5 motion-safe:animate-twinkle motion-reduce:animate-none" /> Admin overview
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}{" "}
              <span className="inline-block motion-safe:animate-wiggle motion-reduce:animate-none origin-bottom-right">👋</span>
            </h1>
            <p className="text-white text-lg sm:text-xl mt-4 max-w-xl font-medium">
              {pendingRequests > 0
                ? `You have ${pendingRequests} pending request${pendingRequests > 1 ? "s" : ""} waiting for you ✨`
                : "Your library is running smoothly today. Great work!"}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                as={Link}
                to="/admin/books"
                size="lg"
                leftIcon={Plus}
                className="bg-white !text-primary-700 hover:bg-gray-50 focus-visible:ring-white shadow-elevated font-bold"
              >
                Add Book
              </Button>
              <Button
                as={Link}
                to="/admin/reports"
                size="lg"
                leftIcon={BarChart2}
                className="!text-white bg-white/15 hover:bg-white/25 border-2 border-white/40 font-bold"
              >
                View Reports
              </Button>
            </div>
          </div>
          <div className="hidden lg:block shrink-0">
            <FloatingArt variant="books" size={220} />
          </div>
        </div>
      </div>

      {/* Stats — wrapped in a structured white section */}
      <section className="rounded-[24px] bg-white border border-gray-200 shadow-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">Overview</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">At a glance</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {stats.map((stat) => (
            <DashboardCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions — wrapped in a white section */}
      <section className="rounded-[24px] bg-white border border-gray-200 shadow-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button as={Link} to="/admin/borrow-records" variant="ghost" size="md" leftIcon={ClipboardList}
            className="bg-gray-50 hover:bg-primary-50 border border-gray-200 text-gray-900 font-semibold shadow-card hover:shadow-elevated">
            {pendingRequests > 0 ? `Review Pending (${pendingRequests})` : "Borrow Records"}
          </Button>
          <Button as={Link} to="/admin/users" variant="ghost" size="md" leftIcon={Users}
            className="bg-gray-50 hover:bg-secondary-50 border border-gray-200 text-gray-900 font-semibold shadow-card hover:shadow-elevated">
            Manage Members
          </Button>
          <Button as={Link} to="/admin/books" variant="ghost" size="md" leftIcon={BookOpen}
            className="bg-gray-50 hover:bg-accent-50 border border-gray-200 text-gray-900 font-semibold shadow-card hover:shadow-elevated">
            Manage Catalog
          </Button>
        </div>
      </section>

      {/* Recent Activity */}
      <Card variant="default" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🔔</span> Recent Activity
          </CardTitle>
          <Badge tone="info" size="sm">{records.length} total</Badge>
        </CardHeader>
        {recentActivity.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentActivity.map((record, i) => (
              <motion.li
                key={record._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between py-3 gap-3 rounded-2xl px-2 -mx-2 hover:bg-primary-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700 grid place-items-center shrink-0 font-semibold text-xs">
                    {(record.user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">
                      {record.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {record.status === "borrowed" ? "Borrowed" : record.status === "returned" ? "Returned" : record.status === "pending" ? "Requested" : record.status === "rejected" ? "Rejected" : record.status} &quot;{record.book?.title || "Unknown"}&quot;
                    </p>
                  </div>
                </div>
                <Badge tone={statusToTone(record.status)} size="sm">{record.status}</Badge>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="py-2">
            <div className="flex flex-col items-center text-center gap-2">
              <FloatingArt variant="reading" size={132} />
              <p className="font-heading font-semibold text-gray-900">All quiet here 📖</p>
              <p className="text-sm text-gray-600">Activity will appear here as members borrow books.</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AdminDashboard;
