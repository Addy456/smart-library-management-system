import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LogOut, Menu, X, BarChart2, Camera, Sun, Moon } from "lucide-react";
import QRScanner from "../books/QRScanner";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Catalog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-surface-100/90 backdrop-blur-xl shadow-card border-b border-gray-200 dark:border-white/10"
          : "bg-white/60 dark:bg-surface-100/40 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-card group-hover:shadow-hero transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-base sm:text-lg text-gray-900 dark:text-white tracking-tight truncate">
              Smart<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Library</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link
                    to="/admin/dashboard"
                    className="text-sm text-indigo-700 dark:text-indigo-300 hover:underline font-bold transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/member/dashboard"
                      className="text-sm text-indigo-700 dark:text-indigo-300 hover:underline font-bold transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/member/analytics"
                      className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-colors"
                      title="Reading Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span className="hidden lg:inline">Analytics</span>
                    </Link>
                    <button
                      onClick={() => setShowQR(true)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
                      title="QR Scanner"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </>
                )}
                <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-extrabold flex items-center justify-center shadow-card">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-bold max-w-[110px] truncate">{user?.name}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs bg-rose-500 text-white hover:bg-rose-600 px-2.5 py-1.5 rounded-full transition-all font-bold shadow-card"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold shadow-card"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 transition-all"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <button
              className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-white/10 shadow-xl"
            >
              <div className="pb-4 pt-2 space-y-1 max-h-[70vh] overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-base font-medium transition-all ${
                      isActive(link.to)
                        ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-3 mx-1 my-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-extrabold flex items-center justify-center shadow-card">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <Link
                      to={user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg text-base text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    >
                      Dashboard
                    </Link>
                    {user?.role === "member" && (
                      <>
                        <Link
                          to="/member/analytics"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 py-3 px-4 rounded-lg text-base text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                        >
                          <BarChart2 className="w-4 h-4" /> Analytics
                        </Link>
                        <button
                          onClick={() => { setMenuOpen(false); setShowQR(true); }}
                          className="flex items-center gap-2 py-3 px-4 rounded-lg text-base text-gray-700 dark:text-gray-300 font-bold w-full text-left hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <Camera className="w-4 h-4" /> QR Scanner
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-3 px-4 rounded-lg text-base text-rose-600 dark:text-rose-400 font-bold w-full text-left hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-3 px-3">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-3 text-base text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 rounded-xl font-bold"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-3 text-base bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-extrabold shadow-card"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>

    {/* QR Scanner modal — rendered OUTSIDE motion.nav to avoid
        transform stacking context breaking fixed positioning.
        The component itself uses a portal, but keeping it here
        at the JSX level makes the intent clear. */}
    {showQR && <QRScanner onClose={() => setShowQR(false)} />}
    </>
  );
};

export default Navbar;
