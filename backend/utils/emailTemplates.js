// HTML email templates. All user-controlled values (name, bookTitle, otp)
// are HTML-escaped before interpolation so they cannot inject tags or scripts
// into the rendered email — even through fields we control today, because
// defence-in-depth beats a future refactor that forgets to escape.

const { escapeHtml } = require("./helpers");
const {
  OTP_TTL_MINUTES,
  RESET_TOKEN_TTL_MINUTES,
  FINE_PER_DAY_INR,
} = require("../config/constants");

const currentYear = new Date().getFullYear();

/**
 * OTP verification email template
 */
exports.otpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px; }
    .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .otp-box { background: #f0f0ff; border: 2px dashed #4F46E5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .otp { font-size: 36px; font-weight: bold; color: #4F46E5; letter-spacing: 8px; }
    .footer { text-align: center; color: #888; margin-top: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Smart Library Management System</h1>
    </div>
    <h2>Hello, ${escapeHtml(name)}!</h2>
    <p>Thank you for registering with Smart Library. Please use the OTP below to verify your email address.</p>
    <div class="otp-box">
      <p>Your OTP Code</p>
      <div class="otp">${escapeHtml(String(otp))}</div>
      <p>This OTP is valid for <strong>${OTP_TTL_MINUTES} minutes</strong></p>
    </div>
    <p>If you did not register, please ignore this email.</p>
    <div class="footer">
      <p>&copy; ${currentYear} Smart Library Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

/**
 * Password reset email template
 */
exports.resetPasswordTemplate = (name, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px; }
    .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .btn { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
    .footer { text-align: center; color: #888; margin-top: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Smart Library Management System</h1>
    </div>
    <h2>Hello, ${escapeHtml(name)}!</h2>
    <p>You have requested to reset your password. Click the button below to reset it.</p>
    <a href="${escapeHtml(resetUrl)}" class="btn">Reset Password</a>
    <p>This link is valid for <strong>${RESET_TOKEN_TTL_MINUTES} minutes</strong>.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <div class="footer">
      <p>&copy; ${currentYear} Smart Library Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

/**
 * Book borrow confirmation email template
 */
exports.borrowConfirmTemplate = (name, bookTitle, issueDate, returnDate) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px; }
    .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #4F46E5; width: 40%; }
    .footer { text-align: center; color: #888; margin-top: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Book Issued Successfully</h1>
    </div>
    <h2>Hello, ${escapeHtml(name)}!</h2>
    <p>Your book has been issued successfully. Here are the details:</p>
    <table class="info-table">
      <tr><td>Book Title</td><td>${escapeHtml(bookTitle)}</td></tr>
      <tr><td>Issue Date</td><td>${escapeHtml(new Date(issueDate).toDateString())}</td></tr>
      <tr><td>Due Date</td><td>${escapeHtml(new Date(returnDate).toDateString())}</td></tr>
    </table>
    <p>Please return the book by the due date to avoid a fine of <strong>&#8377;${FINE_PER_DAY_INR} per day</strong>.</p>
    <div class="footer">
      <p>&copy; ${currentYear} Smart Library Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

/**
 * Book return confirmation email template
 */
exports.returnConfirmTemplate = (name, bookTitle, fine) => {
  const safeFine = Number(fine) || 0;
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px; }
    .header { background: #10B981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .fine-box { background: ${safeFine > 0 ? "#FEF2F2" : "#F0FDF4"}; border: 1px solid ${safeFine > 0 ? "#FCA5A5" : "#86EFAC"}; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .footer { text-align: center; color: #888; margin-top: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Book Returned Successfully</h1>
    </div>
    <h2>Hello, ${escapeHtml(name)}!</h2>
    <p>You have successfully returned <strong>${escapeHtml(bookTitle)}</strong>.</p>
    <div class="fine-box">
      ${safeFine > 0
        ? `<p>A fine of <strong>&#8377;${safeFine}</strong> has been charged for late return.</p>`
        : `<p>No fine charged. Book returned on time!</p>`
      }
    </div>
    <p>Thank you for using Smart Library!</p>
    <div class="footer">
      <p>&copy; ${currentYear} Smart Library Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Overdue reminder email template
 */
exports.overdueReminderTemplate = (name, bookTitle, returnDate, fine) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px; }
    .header { background: #EF4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .alert-box { background: #FEF2F2; border: 1px solid #FCA5A5; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .footer { text-align: center; color: #888; margin-top: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Overdue Book Reminder</h1>
    </div>
    <h2>Hello, ${escapeHtml(name)}!</h2>
    <div class="alert-box">
      <p>Your borrowed book <strong>${escapeHtml(bookTitle)}</strong> was due on <strong>${escapeHtml(new Date(returnDate).toDateString())}</strong>.</p>
      <p>Current fine: <strong>&#8377;${Number(fine) || 0}</strong> (&#8377;${FINE_PER_DAY_INR}/day)</p>
    </div>
    <p>Please return the book as soon as possible to avoid further fines.</p>
    <div class="footer">
      <p>&copy; ${currentYear} Smart Library Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
