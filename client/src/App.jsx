import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

// Load user action
import { loadUser } from "./redux/slices/authSlice";

// Layouts (always loaded — above the fold)
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import MemberLayout from "./layouts/MemberLayout";

// Route guard
import ProtectedRoute from "./components/common/ProtectedRoute";

// Suspense fallback
import PageSkeleton from "./components/common/PageSkeleton";

// ─── Lazy-loaded pages (code-split per route) ───
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Catalog = lazy(() => import("./pages/Catalog"));
const BookDetail = lazy(() => import("./pages/BookDetail"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageBooks = lazy(() => import("./pages/admin/ManageBooks"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const BorrowRecords = lazy(() => import("./pages/admin/BorrowRecords"));
const Reports = lazy(() => import("./pages/admin/Reports"));

const MemberDashboard = lazy(() => import("./pages/member/MemberDashboard"));
const MyBooks = lazy(() => import("./pages/member/MyBooks"));
const Profile = lazy(() => import("./pages/member/Profile"));
const ReadingAnalytics = lazy(() => import("./pages/member/ReadingAnalytics"));

import "./App.css";

function App() {
  const dispatch = useDispatch();

  // Load user on app start (checks if cookie is valid)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#1f2937", color: "#fff" },
          success: { iconTheme: { primary: "#4ade80", secondary: "#fff" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#fff" } },
        }}
      />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* ─── Public shell (Navbar + Footer) ─── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/books/:id" element={<BookDetail />} />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                    <h1 className="text-8xl sm:text-9xl font-bold gradient-text font-heading">404</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xl mt-4 mb-2">Oops! Page not found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 max-w-md">
                      The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all"
                    >
                      Back to Home
                    </Link>
                  </div>
                }
              />
            </Route>

            {/* ─── Admin shell (Sidebar + Topbar + Breadcrumbs) ─── */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<ManageBooks />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/borrow-records" element={<BorrowRecords />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>

            {/* ─── Member shell (Sidebar + Topbar + Breadcrumbs) ─── */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["member", "admin"]}>
                  <MemberLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/member/profile" element={<Profile />} />
            </Route>
            <Route
              element={
                <ProtectedRoute allowedRoles={["member"]}>
                  <MemberLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route path="/member/my-books" element={<MyBooks />} />
              <Route path="/member/analytics" element={<ReadingAnalytics />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
