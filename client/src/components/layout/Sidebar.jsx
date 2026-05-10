import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart2,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/books", icon: BookOpen, label: "Manage Books" },
    { to: "/admin/users", icon: Users, label: "Manage Users" },
    { to: "/admin/borrow-records", icon: FileText, label: "Borrow Records" },
    { to: "/admin/reports", icon: BarChart2, label: "Reports" },
  ];

  const bottomItems = [
    { to: "/member/profile", icon: UserCircle, label: "My Profile" },
  ];

  const navContent = (
    <div className="flex flex-col h-full">
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-200 dark:border-white/5 pt-4 mt-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button — positioned to avoid QR FAB overlap */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-20 left-4 z-50 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3.5 rounded-full shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-indigo-500 transition-all"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay + drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-surface-100 border-r border-gray-200 dark:border-white/5 shadow-xl overflow-y-auto">
            <div className="p-5 sm:p-6 safe-bottom">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-gray-900 dark:text-white font-bold text-lg">Admin Panel</h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {navContent}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-surface-100 min-h-screen border-r border-gray-200 dark:border-white/5 flex-shrink-0">
        <div className="p-6">
          <h2 className="font-heading text-gray-900 dark:text-white font-bold text-lg mb-8">Admin Panel</h2>
          {navContent}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
