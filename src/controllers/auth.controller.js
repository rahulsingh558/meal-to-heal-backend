const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      customerPhone: phone || ""
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.customerPhone
      }
    });
  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: email },
        { customerPhone: email }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login via Google/WhatsApp or reset your password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.customerPhone
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user);

    const frontendUrl = process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'http://localhost:4200'
      : 'http://localhost:4200';

    res.redirect(`${frontendUrl}/auth/callback?token=${token}&userId=${req.user._id}&role=${req.user.role}&userName=${encodeURIComponent(req.user.name)}&userEmail=${encodeURIComponent(req.user.email)}`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'http://localhost:4200'
      : 'http://localhost:4200';
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

// --- WhatsApp OTP Methods ---

exports.sendWhatsAppOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const OTP = require('../models/OTP');
    await OTP.findOneAndUpdate(
      { phone },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Meal to Heal verification code is: ${otp}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phone}`
      });
      console.log(`OTP sent to ${phone} via Twilio`);
    } else {
      console.log(`[MOCK TWILIO] OTP for ${phone} is: ${otp}`);
    }

    res.json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

exports.verifyWhatsAppOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const OTP = require('../models/OTP');
    const otpRecord = await OTP.findOne({ phone, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({
      $or: [
        { customerPhone: phone },
        { email: `${phone}@whatsapp.user` }
      ]
    });

    let token;
    let isNewUser = false;

    if (user) {
      token = generateToken(user);
    } else {
      isNewUser = true;
      user = await User.create({
        name: "WhatsApp User",
        email: `${phone}@whatsapp.user`,
        password: require('crypto').randomBytes(8).toString('hex'),
        provider: 'whatsapp',
        customerPhone: phone,
        isEmailVerified: true
      });
      token = generateToken(user);
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      isNewUser
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

// --- Forgot Password Methods ---

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Email or Phone number is required" });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { customerPhone: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const isEmail = identifier.includes('@');

    const OTP = require('../models/OTP');
    const updateQuery = isEmail ? { email: identifier } : { phone: identifier };

    await OTP.findOneAndUpdate(
      updateQuery,
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    if (isEmail) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: 'Password Reset OTP - Meal to Heal',
        text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to your email", success: true, type: 'email' });
      } else {
        console.log(`[MOCK EMAIL] Reset OTP for ${identifier}: ${otp}`);
        res.json({ message: "OTP generated (Check console)", success: true, type: 'email' });
      }
    } else {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Your Meal to Heal password reset code is: ${otp}`,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${identifier}`
        });
        res.json({ message: "OTP sent to your phone", success: true, type: 'phone' });
      } else {
        console.log(`[MOCK TWILIO] Reset OTP for ${identifier}: ${otp}`);
        res.json({ message: "OTP generated (Check console)", success: true, type: 'phone' });
      }
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Failed to process request", error: error.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ message: "Identifier and OTP are required" });
    }

    const isEmail = identifier.includes('@');
    const OTP = require('../models/OTP');

    const query = isEmail ? { email: identifier, otp } : { phone: identifier, otp };
    const otpRecord = await OTP.findOne(query);

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP Verified", success: true });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isEmail = identifier.includes('@');
    const OTP = require('../models/OTP');

    const otpQuery = isEmail ? { email: identifier, otp } : { phone: identifier, otp };
    const otpRecord = await OTP.findOne(otpQuery);

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const userQuery = isEmail ? { email: identifier } : { customerPhone: identifier };
    const user = await User.findOneAndUpdate(
      userQuery,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password reset successfully", success: true });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};
