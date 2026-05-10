import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { cn } from "../components/ui/cn";

/**
 * AppSidebar — shared sidebar for Admin & Member layouts.
 *
 * Props:
 *  - title        : string shown in the sidebar header (e.g. "Admin Panel")
 *  - items        : [{ to, icon, label, badge? }]
 *  - bottomItems? : same shape, rendered after a divider
 *  - mobileOpen   : boolean
 *  - onMobileClose: () => void
 *
 * Layout contract:
 *  - Desktop (lg+): static 260px rail, always visible
 *  - Mobile (<lg) : slide-in drawer with backdrop
 */
const AppSidebar = ({ title, items, bottomItems = [], mobileOpen, onMobileClose }) => {
  const Nav = ({ list }) => (
    <nav className="space-y-1">
      {list.map(({ to, icon: Icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          end
          onClick={onMobileClose}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              isActive
                ? "bg-gradient-to-r from-primary-50 to-primary-100/60 text-primary-700 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.15)] dark:from-primary-500/15 dark:to-primary-500/5 dark:text-primary-300 dark:shadow-none"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white hover:translate-x-0.5"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-primary-500 to-primary-700" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                )}
              />
              <span className="flex-1 truncate">{label}</span>
              {typeof badge !== "undefined" && badge !== null && (
                <span
                  className={cn(
                    "text-[11px] font-semibold rounded-full px-2 py-0.5",
                    isActive
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  )}
                >
                  {badge}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white grid place-items-center shadow-card">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading font-bold text-gray-900 dark:text-white text-sm leading-tight">
              Smart Library
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close sidebar"
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 flex-1 overflow-y-auto">
        <Nav list={items} />
        {bottomItems.length > 0 && (
          <>
            <div className="my-4 h-px bg-gray-200 dark:bg-white/5 mx-2" />
            <Nav list={bottomItems} />
          </>
        )}
      </div>

      <div className="px-5 py-4 text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-white/5">
        © {new Date().getFullYear()} Smart Library
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-gray-200/70 dark:border-white/5 bg-white/60 dark:bg-surface-900/80 backdrop-blur-xl">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-white/5 shadow-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSidebar;
