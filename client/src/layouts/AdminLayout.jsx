import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart2,
  UserCircle,
} from "lucide-react";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import AppBreadcrumbs from "./AppBreadcrumbs";

const NAV_ITEMS = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/books", icon: BookOpen, label: "Manage Books" },
  { to: "/admin/users", icon: Users, label: "Manage Users" },
  { to: "/admin/borrow-records", icon: FileText, label: "Borrow Records" },
  { to: "/admin/reports", icon: BarChart2, label: "Reports" },
];

const BOTTOM_ITEMS = [
  { to: "/member/profile", icon: UserCircle, label: "My Profile" },
];

/**
 * AdminLayout — Sidebar + Topbar + Breadcrumbs + Content.
 * Renders once per route tree; pages render only their own content.
 */
const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background dark:bg-surface-900">
      <AppSidebar
        title="Admin Panel"
        items={NAV_ITEMS}
        bottomItems={BOTTOM_ITEMS}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col bg-app-canvas dark:bg-surface-900">
        <AppTopbar onMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <div className="mx-auto max-w-7xl space-y-8">
            <AppBreadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
