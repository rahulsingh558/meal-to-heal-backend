const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
router.post("/send", chatController.sendMessage);
router.get("/messages/:sessionId", chatController.getSessionMessages);
router.get("/user/:userId", chatController.getUserSession);

// Admin-only routes
router.get("/sessions", authMiddleware, chatController.getAllSessions);
router.put("/read/:sessionId", chatController.markAsRead);
router.put("/session/:sessionId/status", authMiddleware, chatController.updateSessionStatus);
router.get("/unread", chatController.getUnreadCount);
router.get("/unread/:sessionId", chatController.getUnreadCount);

module.exports = router;
