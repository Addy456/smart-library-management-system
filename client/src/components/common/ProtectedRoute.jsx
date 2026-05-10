import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";

// Route guard component - checks authentication and role
// loading starts as true (auth hydration) so we never flash the login redirect.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Still hydrating auth from cookie/token — show skeleton, never redirect
  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
