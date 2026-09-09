// backend/config/email.js
const nodemailer = require('nodemailer');

// Gmail SMTP setup (ya apna email provider use karo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'ChefSet - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff; border-radius: 10px;">
          <h1 style="color: #e8a33c;">CHEF<span style="color: #ffffff;">SET</span></h1>
          <h2 style="color: #ffffff;">Reset Your Password</h2>
          <p style="color: #aaaaaa;">You requested to reset your password. Use the following OTP code:</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e8a33c;">
            <h1 style="color: #e8a33c; font-size: 2.5rem; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #888888; font-size: 0.8rem; margin-top: 20px;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #2a2a2a;" />
          <p style="color: #666666; font-size: 0.7rem; text-align: center;">&copy; 2026 CHEFSET. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = { sendOTPEmail };