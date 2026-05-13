import emailjs from "@emailjs/browser";

export const sendOTPEmail = async (name, email, otp) => {
  try {
    const response = await emailjs.send(
      "Gmail otp library",
      "template_1iprbct",
      {
        name,
        email,
        otp,
      },
      "m4P66U2DH0yzVq00h"
    );

    console.log("OTP Email Sent:", response);
    return true;
  } catch (error) {
    console.error("EmailJS Error:", error);
    return false;
  }
};