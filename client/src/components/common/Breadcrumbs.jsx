import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const labels = {
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

const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label: labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    path: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
      <Link to="/" className="hover:text-violet-400 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
          {crumb.isLast ? (
            <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-violet-400 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
