import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  UserCircle,
  Library,
} from "lucide-react";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import AppBreadcrumbs from "./AppBreadcrumbs";

const NAV_ITEMS = [
  { to: "/member/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/member/my-books", icon: BookOpen, label: "My Books" },
  { to: "/member/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/catalog", icon: Library, label: "Browse Catalog" },
];

const BOTTOM_ITEMS = [
  { to: "/member/profile", icon: UserCircle, label: "My Profile" },
];

/**
 * MemberLayout — mirrors AdminLayout so members get the same
 * SaaS shell (sidebar + topbar + breadcrumbs + content).
 */
const MemberLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background dark:bg-surface-900">
      <AppSidebar
        title="Member"
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

export default MemberLayout;
