import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyRecordsIfNeeded } from "../../redux/slices/borrowSlice";
import { getMyWaitlist } from "../../redux/slices/waitlistSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, AlertCircle, Clock, ArrowRight, BarChart2, BookOpenCheck, Sparkles, Library } from "lucide-react";
import RecommendedBooks from "../../components/books/RecommendedBooks";
import QRScanner, { QRScannerFAB } from "../../components/books/QRScanner";
import DashboardCard from "../../components/common/DashboardCard";
import FloatingArt from "../../components/common/FloatingArt";
import {
  useGameStats,
  StreakBadge,
  XPBar,
  AchievementsGrid,
} from "../../components/common/Gamification";
import { useConfetti } from "../../components/common/Confetti";
import { Badge, Button, Card, CardHeader, CardTitle } from "../../components/ui";
import { cn } from "../../components/ui/cn";

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myRecords } = useSelector((state) => state.borrow);
  const { myWaitlist } = useSelector((state) => state.waitlist);
  const [showQR, setShowQR] = useState(false);
  const { fire, ConfettiPortal } = useConfetti();

  useEffect(() => {
    dispatch(fetchMyRecordsIfNeeded());
    dispatch(getMyWaitlist());
  }, [dispatch]);

  const activeBorrows = useMemo(() => myRecords.filter((r) => r.status === "borrowed"), [myRecords]);
  const overdue = useMemo(
    () => activeBorrows.filter((r) => new Date(r.returnDate) < new Date()),
    [activeBorrows]
  );
  const returned = useMemo(() => myRecords.filter((r) => r.status === "returned"), [myRecords]);
  const gameStats = useGameStats(myRecords);

  // Celebrate when this session reveals a freshly-unlocked milestone (level ≥ 2).
  useEffect(() => {
    if (gameStats.level >= 2 && myRecords.length > 0) {
      const key = `celebrated-level-${gameStats.level}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        setTimeout(() => fire({ origin: { x: "50%", y: "30%" } }), 500);
      }
    }
  }, [gameStats.level, myRecords.length, fire]);

  const stats = [
    { label: "Books Borrowed",  value: activeBorrows.length, icon: <BookOpen className="w-6 h-6" />,     tone: "info"      },
    { label: "Overdue Books",   value: overdue.length,       icon: <AlertCircle className="w-6 h-6" />,  tone: "danger"    },
    { label: "Books Returned",  value: returned.length,      icon: <Clock className="w-6 h-6" />,        tone: "secondary" },
  ];

  const quickLinks = [
    { to: "/member/my-books",  title: "My Borrowed Books", desc: "Pick up where you left off",               icon: BookOpen,  tone: "primary"   },
    { to: "/catalog",          title: "Browse Catalog",    desc: "Find your next favourite read ✨",           icon: Library,   tone: "accent"    },
    { to: "/member/analytics", title: "Reading Analytics", desc: "See how far you’ve come this month",         icon: BarChart2, tone: "secondary" },
  ];

  const tileAccent = {
    primary:   "from-primary-400 to-primary-600     text-white shadow-card",
    accent:    "from-accent-400  to-accent-600      text-white shadow-card",
    secondary: "from-secondary-400 to-secondary-600 text-white shadow-card",
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* HERO — bold violet/purple/pink gradient, page’s anchor */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-indigo-700 via-violet-600 to-blue-600 text-white shadow-hero"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-accent-400/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%)]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] bg-white/20 text-white border border-white/30 rounded-full px-3.5 py-1.5">
                <Sparkles className="h-3.5 w-3.5 motion-safe:animate-twinkle motion-reduce:animate-none" /> Your library
              </div>
              <StreakBadge streak={gameStats.streak} />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Hi, {user?.name?.split(" ")[0] || "reader"}{" "}
              <span className="inline-block motion-safe:animate-wiggle motion-reduce:animate-none origin-bottom-right">👋</span>
            </h1>
            <p className="text-white text-lg sm:text-xl mt-4 max-w-xl font-medium">
              {activeBorrows.length > 0
                ? `You have ${activeBorrows.length} book${activeBorrows.length > 1 ? "s" : ""} on the go. Keep it up — you’re doing amazing! 📚`
                : "Ready to start your next reading adventure? Let’s go! ✨"}
            </p>

            {/* XP / Level progress */}
            <div className="mt-5">
              <XPBar
                level={gameStats.level}
                xpInLevel={gameStats.xpInLevel}
                xpToNext={gameStats.xpToNext}
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                as={Link}
                to="/catalog"
                size="lg"
                leftIcon={Library}
                className="bg-white !text-primary-700 hover:bg-gray-50 focus-visible:ring-white shadow-elevated font-bold"
              >
                Continue your journey
              </Button>
              <Button
                as={Link}
                to="/member/my-books"
                size="lg"
                leftIcon={BookOpen}
                className="!text-white bg-white/15 hover:bg-white/25 border-2 border-white/40 font-bold"
              >
                My books
              </Button>
            </div>
          </div>
          <div className="hidden lg:block shrink-0">
            <FloatingArt variant="cozy" size={210} />
          </div>
        </div>
      </motion.div>

      {/* Stats — wrapped in a structured white section */}
      <section className="rounded-[24px] bg-white border border-gray-200 shadow-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">Your reading snapshot</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">This month</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <DashboardCard
                title={stat.label}
                count={stat.value}
                icon={stat.icon}
                tone={stat.tone}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <div className="rounded-[24px] p-5 bg-white border-2 border-danger-300 flex items-start gap-4 shadow-card">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-danger-500 to-danger-600 text-white grid place-items-center shrink-0 shadow-card">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-danger-700">
              You have {overdue.length} overdue book{overdue.length > 1 ? "s" : ""}!
            </p>
            <p className="text-sm text-gray-700 mt-0.5">
              Fine accruing at ₹5/day. Please return them as soon as possible.
            </p>
          </div>
        </div>
      )}

      {/* Waitlist */}
      {myWaitlist.length > 0 && (
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-500 motion-safe:animate-bounce-soft motion-reduce:animate-none" />
              Your waitlist ⏳
            </CardTitle>
            <Badge tone="warning" size="sm">{myWaitlist.length}</Badge>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myWaitlist.map((entry) => (
              <div
                key={entry._id}
                className="group flex items-center gap-3 rounded-2xl p-3 bg-gray-50 border border-gray-200 hover:border-primary-300 hover:bg-white hover:shadow-card transition-all"
              >
                <div className="h-12 w-10 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 grid place-items-center shrink-0">
                  {entry.book?.coverImage ? (
                    <img src={entry.book.coverImage} alt={entry.book.title} className="h-full w-full object-cover" />
                  ) : (
                    <BookOpenCheck className="w-4 h-4 text-primary-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${entry.book?._id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-primary-600 truncate block transition-colors"
                  >
                    {entry.book?.title}
                  </Link>
                  <p className="text-xs text-gray-600 truncate">by {entry.book?.author}</p>
                </div>
                {entry.status === "notified" ? (
                  <Badge tone="warning" size="sm" className="animate-pulse">Claim now!</Badge>
                ) : (
                  <Badge tone="info" size="sm">#{entry.position}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Links — wrapped in white section with playful interactive tiles */}
      <section className="rounded-[24px] bg-white border border-gray-200 shadow-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">Jump back in</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Shortcuts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((q, i) => (
            <motion.div
              key={q.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, rotate: -0.8, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fire({ origin: { x: "50%", y: "40%" } })}
            >
              <Link
                to={q.to}
                className={cn(
                  "group relative overflow-hidden block rounded-2xl p-5",
                  "bg-gray-50",
                  "border border-gray-200",
                  "transition-all duration-300",
                  "hover:bg-white hover:border-primary-200 hover:shadow-elevated"
                )}
              >
                <div className="relative flex items-start gap-4">
                  <div className={cn(
                    "h-14 w-14 rounded-2xl grid place-items-center shrink-0 bg-gradient-to-br shadow-card",
                    "transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6",
                    tileAccent[q.tone]
                  )}>
                    <q.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-gray-900 text-base">{q.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{q.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 motion-safe:group-hover:translate-x-1.5 group-hover:text-primary-600 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements — gamification strip */}
      <AchievementsGrid stats={gameStats} />

      {/* AI Recommendations */}
      <RecommendedBooks />

      {/* Floating QR Scanner FAB */}
      <QRScannerFAB onClick={() => setShowQR(true)} />

      {/* QR Scanner Modal */}
      {showQR && <QRScanner onClose={() => setShowQR(false)} />}

      {/* Confetti overlay */}
      <ConfettiPortal />
    </motion.div>
  );
};

export default MemberDashboard;
