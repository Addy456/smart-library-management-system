import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../components/ui/cn";

const LABELS = {
  admin: "Admin",
  member: "Member",
  dashboard: "Dashboard",
  books: "Manage Books",
  users: "Manage Users",
  "borrow-records": "Borrow Records",
  reports: "Reports",
  "my-books": "My Books",
  profile: "Profile",
  analytics: "Reading Analytics",
  catalog: "Catalog",
  about: "About",
  contact: "Contact",
  settings: "Settings",
};

/**
 * AppBreadcrumbs — route-derived trail.
 * Hides itself on top-level or auth-like routes.
 */
const AppBreadcrumbs = ({ className }) => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label: LABELS[seg] || decodeURIComponent(seg).replace(/-/g, " "),
    path: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap",
        className
      )}
    >
      <Link
        to="/"
        className="inline-flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
          {crumb.isLast ? (
            <span
              aria-current="page"
              className="font-medium text-gray-900 dark:text-white capitalize"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors capitalize"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default AppBreadcrumbs;
