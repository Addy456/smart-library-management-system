import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, LogOut, Search, Bell, UserCircle, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../redux/slices/authSlice";
import { Input } from "../components/ui";
import { cn } from "../components/ui/cn";
import { useTheme } from "../context/ThemeContext";

/**
 * AppTopbar — sticky header for Admin / Member layouts (light-only theme).
 *
 * Slots:
 *  - hamburger (lg:hidden)  → opens sidebar drawer
 *  - search input           → optional, shown on md+
 *  - notifications          → visual indicator only for now
 *  - user menu              → avatar + dropdown (profile / logout)
 */
const AppTopbar = ({ onMobileMenu, showSearch = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8",
        "bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl",
        "border-b border-gray-200/70 dark:border-white/10",
        "shadow-[0_1px_0_0_rgba(15,23,42,0.03)]"
      )}
    >
      <button
        type="button"
        onClick={onMobileMenu}
        aria-label="Open navigation"
        className="lg:hidden p-2 rounded-2xl text-gray-600 hover:bg-gray-100 transition-colors motion-safe:active:scale-95"
      >
        <Menu className="h-5 w-5" />
      </button>

      {showSearch && (
        <div className="hidden md:block flex-1 max-w-md">
          <Input
            fullWidth
            size="md"
            leftIcon={Search}
            placeholder="Search books, members…"
            aria-label="Search"
            className="bg-gray-100/70 border-transparent focus-within:bg-white"
          />
        </div>
      )}

      <div className="flex-1 md:hidden" />
      <div className="hidden md:block flex-1" />

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="p-2 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors motion-safe:active:scale-95"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <button
        type="button"
        aria-label="Notifications"
        className="relative p-2 rounded-2xl text-gray-600 hover:bg-gray-100 transition-colors motion-safe:active:scale-95"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
      </button>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      {/* User menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white grid place-items-center text-xs font-semibold shadow-card">
            {initials}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-gray-800 max-w-[120px] truncate">
            {user?.name}
          </span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              role="menu"
              className="absolute right-0 top-full mt-2 w-60 rounded-3xl border border-gray-200/80 bg-white shadow-modal p-2"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-3 py-2.5 mb-1 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <Link
                to="/member/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                role="menuitem"
              >
                <UserCircle className="h-4 w-4" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default AppTopbar;
