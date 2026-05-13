import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP, clearAuthState } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { AuthCard } from "../components/ui";

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const email = localStorage.getItem("verifyEmail") || "";

  useEffect(() => {
    // If no email stored, user shouldn't be on this page
    if (!email) {
      toast.error("Please register first.");
      navigate("/register");
      return;
    }
  }, [email, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("verifyEmail");
      navigate("/member/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  // const handleVerify = async (e) => {
  //   e.preventDefault();
  //   if (!otp || otp.length !== 6) {
  //     toast.error("Please enter a valid 6-digit OTP");
  //     return;
  //   }
  //   dispatch(verifyOTP({ email, otp }));
  // };

  const handleVerify = async (e) => {
  e.preventDefault();

  const savedOTP = localStorage.getItem("otp");

  if (!otp || otp.length !== 6) {
    toast.error("Please enter a valid 6-digit OTP");
    return;
  }

  if (otp !== savedOTP) {
    toast.error("Invalid OTP");
    return;
  }

  const result = await dispatch(verifyOTP({ email, otp }));

  if (result.meta.requestStatus === "fulfilled") {

    toast.success("Email verified successfully!");

    localStorage.removeItem("otp");
    localStorage.removeItem("verifyEmail");

    navigate("/login");
  }
};

 
const handleResend = async () => {

  if (!email) {
    toast.error("Email not found. Please register again.");
    return;
  }

 await sendOTPEmail(
  "User",
  email,
  localStorage.getItem("otp")
);
  toast.success("OTP resent successfully!");

  setResendCooldown(60);
};
  return (
    <AuthCard
      icon={<ShieldCheck className="w-7 h-7 text-white" />}
      title="Verify your email"
      subtitle={<>Enter the 6-digit OTP sent to <br /><span className="font-bold underline decoration-white/60">{email}</span></>}
      accent="emerald"
    >
      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-white dark:bg-surface-200 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-extrabold"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">OTP is valid for 10 minutes</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold disabled:opacity-50 shadow-card"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </motion.button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Didn&apos;t receive the OTP?{" "}
          <button
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline disabled:opacity-50 transition-colors"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </AuthCard>
  );
};

export default VerifyOTP;
