const nodemailer = require("nodemailer");

// Singleton transporter — reuses TCP connection pool across calls
let transporter;
function getTransporter() {
  if (!transporter) {
  transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },

  family: 4,

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  tls: {
    rejectUnauthorized: false,
  },
});
  }
  return transporter;
}

const sendEmail = async (options) => {
  const info = await getTransporter().sendMail({
    from: `Smart Library <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  });

  console.log("Email sent:", info.messageId);
};

module.exports = sendEmail;
