const nodemailer = require("nodemailer");

// Singleton transporter — reuses TCP connection pool across calls
let transporter;
function getTransporter() {
  if (!transporter) {
  transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },

  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },

  family: 4,

  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
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
