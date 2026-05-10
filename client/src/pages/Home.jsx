import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Library,
  Star,
  Search,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

/* ─────────────── Animated Count Up ─────────────── */
const CountUp = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: BookOpen,
      title: "Smart Book Management",
      description:
        "Effortlessly add, update, and organize your entire catalog with powerful search, filters, and AI-powered recommendations.",
      gradient: "from-indigo-500 to-violet-600",
      tint: "bg-indigo-50 dark:bg-indigo-500/10",
      accent: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: Users,
      title: "Member Tracking",
      description:
        "Keep track of all borrowed books, due dates, and return history for every member. Real-time dashboard insights at your fingertips.",
      gradient: "from-sky-500 to-blue-600",
      tint: "bg-sky-50 dark:bg-sky-500/10",
      accent: "text-sky-600 dark:text-sky-400",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Automated email reminders for overdue books, fine calculations, and personalized reading recommendations powered by AI.",
      gradient: "from-amber-500 to-orange-600",
      tint: "bg-amber-50 dark:bg-amber-500/10",
      accent: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find any book in seconds with fuzzy matching, category filters, ISBN lookup, and QR-code scanning for physical copies.",
      gradient: "from-emerald-500 to-teal-600",
      tint: "bg-emerald-50 dark:bg-emerald-500/10",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: BarChart3,
      title: "Reading Analytics",
      description:
        "Visualize your reading journey with a heatmap calendar, category breakdowns, and monthly progress charts.",
      gradient: "from-fuchsia-500 to-purple-600",
      tint: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
      accent: "text-fuchsia-600 dark:text-fuchsia-400",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description:
        "JWT-based auth with httpOnly cookies, email OTP verification, and role-based access keep your library safe.",
      gradient: "from-rose-500 to-pink-600",
      tint: "bg-rose-50 dark:bg-rose-500/10",
      accent: "text-rose-600 dark:text-rose-400",
    },
  ];


// animation counting 

  const stats = [
    { value: 500, suffix: "+", label: "Books Available", icon: Library },
    { value: 200, suffix: "+", label: "Active Members", icon: Users },
    { value: 1000, suffix: "+", label: "Books Borrowed", icon: TrendingUp },
    { value: 99, suffix: "%", label: "Happy Readers", icon: Star },
  ];

  const trustPoints = [
    { icon: Shield, label: "Secure JWT auth" },
    { icon: Zap, label: "Lightning fast" },
    { icon: Star, label: "Rated 4.9/5" },
    { icon: Sparkles, label: "AI-powered" },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-600 to-blue-600" />
        <div className="absolute top-0 -left-40 w-[28rem] h-[28rem] bg-fuchsia-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[28rem] h-[28rem] bg-cyan-400/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left column - content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  AI-Powered Library Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6"
              >
                The future of{" "}
                <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
                  library
                </span>{" "}
                <br className="hidden sm:block" />
                management.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                A complete digital platform to run your library seamlessly. Track books, manage members,
                automate reminders — all wrapped in a beautiful, lightning-fast experience.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                {isAuthenticated ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"}
                      className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-extrabold hover:bg-gray-100 transition-all shadow-hero text-base"
                    >
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-extrabold hover:bg-gray-100 transition-all shadow-hero text-base"
                    >
                      Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all text-base"
                  >
                    Browse Catalog
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5 mt-10"
              >
                {trustPoints.map((point) => (
                  <div
                    key={point.label}
                    className="flex items-center gap-1.5 text-white/85 text-sm font-semibold"
                  >
                    <point.icon className="w-4 h-4 text-amber-200" />
                    {point.label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column - illustration (floating book cards) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 hidden lg:block relative"
            >
              <div className="relative h-[440px]">
                {/* Card 1 - back */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 left-8 w-48 h-64 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-hero -rotate-12 p-5 flex flex-col justify-between"
                >
                  <BookOpen className="w-10 h-10 text-white/90" />
                  <div>
                    <div className="text-xs text-white/80 font-bold uppercase tracking-wider">BCA · Sem 6</div>
                    <div className="text-lg font-extrabold text-white mt-1 leading-tight">Machine Learning</div>
                  </div>
                </motion.div>
                {/* Card 2 - middle */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 w-52 h-72 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-hero rotate-3 p-5 flex flex-col justify-between z-10"
                >
                  <Library className="w-10 h-10 text-white/90" />
                  <div>
                    <div className="text-xs text-white/80 font-bold uppercase tracking-wider">Featured</div>
                    <div className="text-lg font-extrabold text-white mt-1 leading-tight">Clean Architecture</div>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
                      <span className="text-white text-xs font-bold">4.9</span>
                    </div>
                  </div>
                </motion.div>
                {/* Card 3 - front */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="absolute bottom-0 right-4 w-48 h-64 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-hero rotate-6 p-5 flex flex-col justify-between z-20"
                >
                  <Sparkles className="w-10 h-10 text-white/90" />
                  <div>
                    <div className="text-xs text-white/80 font-bold uppercase tracking-wider">Popular</div>
                    <div className="text-lg font-extrabold text-white mt-1 leading-tight">Design Patterns</div>
                  </div>
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-0 bg-white rounded-2xl shadow-hero p-3.5 flex items-center gap-3 z-30"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Returned</div>
                    <div className="text-sm font-extrabold text-gray-900">On time · +10 XP</div>
                  </div>
                </motion.div>

                {/* Floating badge 2 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-0 right-0 bg-white rounded-2xl shadow-hero p-3.5 flex items-center gap-3 z-30"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">This week</div>
                    <div className="text-sm font-extrabold text-gray-900">+24 borrows</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BAND ═══════════════ */}
      <section className="relative -mt-6 sm:-mt-10 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="bg-white dark:bg-surface-100 border border-gray-200 dark:border-white/10 rounded-[28px] shadow-hero p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-4 ${i < 3 ? "md:border-r md:border-gray-200 dark:md:border-white/10 md:pr-6" : ""}`}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-card">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
                        <CountUp target={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bold mt-1 truncate">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-extrabold text-indigo-600 dark:text-indigo-400 tracking-[0.2em] uppercase mb-3">
              Features
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              Everything you need, beautifully built.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              Powerful features designed to make modern library management a delight.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={index * 0.06}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="relative bg-white dark:bg-surface-200 border border-gray-200 dark:border-white/10 rounded-[22px] p-6 h-full hover:shadow-hero transition-shadow overflow-hidden group"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${feature.gradient}`} />
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-card`}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-3">
              How it works
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Three steps to a smarter library.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 relative">
            {[
              { step: "01", icon: Users, title: "Create an account", desc: "Sign up in seconds with email OTP verification." },
              { step: "02", icon: Search, title: "Browse the catalog", desc: "Search books by title, author, category, or scan a QR." },
              { step: "03", icon: Clock, title: "Borrow & enjoy", desc: "One-click borrow with automated reminders before due dates." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative bg-white dark:bg-surface-100 border border-gray-200 dark:border-white/10 rounded-[22px] p-6 lg:p-8 h-full shadow-card hover:shadow-hero transition-shadow">
                  <div className="absolute -top-4 left-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-extrabold px-3 py-1 rounded-full tracking-wider shadow-card">
                    STEP {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center mb-5 mt-2">
                    <item.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative bg-gradient-to-br from-indigo-700 via-violet-600 to-blue-600 rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-hero overflow-hidden">
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <span className="inline-block text-xs font-extrabold text-white/90 tracking-[0.2em] uppercase mb-4">
                  Get Started Today
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                  Ready to transform{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
                    your library?
                  </span>
                </h2>
                <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                  Join libraries already using SmartLibrary. Start your journey — it&apos;s free forever.
                </p>

                {!isAuthenticated && (
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-extrabold hover:bg-gray-100 transition-all shadow-hero text-base sm:text-lg group"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}

                <p className="text-xs text-white/70 mt-5 font-semibold">
                  No credit card · Free forever · Setup in 2 minutes
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Home;
