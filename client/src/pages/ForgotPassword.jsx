import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword, clearAuthState } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, ExternalLink, KeyRound } from "lucide-react";
import { AuthCard } from "../components/ui";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, resetUrl } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(result.payload.message || "Reset link sent!");
    }
  };

  return (
    <AuthCard
      icon={<KeyRound className="w-7 h-7 text-white" />}
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      accent="amber"
      footer={
        <>
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Back to Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-200 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold disabled:opacity-50 shadow-card"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>
      </form>

      {resetUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-semibold">
            Click the link below to reset your password:
          </p>
          <Link
            to={resetUrl.replace(/^https?:\/\/[^/]+/, "")}
            className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm break-all transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            Reset Password
          </Link>
        </motion.div>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
