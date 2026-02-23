const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const passport = require('passport');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);

// Google OAuth Routes
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback",
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    authController.googleCallback
);

// WhatsApp OTP Routes
router.post("/whatsapp/send-otp", authController.sendWhatsAppOtp);
router.post("/whatsapp/verify-otp", authController.verifyWhatsAppOtp);

// Forgot Password Routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;