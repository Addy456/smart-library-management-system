const User = require("../models/userModel");
const sendEmail = require("./sendEmail");
const { otpTemplate } = require("./emailTemplates");

// Generate a 6-digit OTP, save to user, and send via email
const sendVerificationCode = async (user) => {
  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Set OTP expiry to 10 minutes from now
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // Save OTP to user document
  await User.findByIdAndUpdate(user._id, { otp, otpExpiry });

  // Send OTP via email
  await sendEmail({
    email: user.email,
    subject: "Smart Library - Email Verification OTP",
    html: otpTemplate(user.name, otp),
  });
};

module.exports = sendVerificationCode;
