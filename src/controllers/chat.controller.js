const chatService = require("../services/chat.service");

exports.sendMessage = async (req, res) => {
    try {
        const message = await chatService.sendMessage(req.body);
        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};

exports.getSessionMessages = async (req, res) => {
    try {
        const messages = await chatService.getSessionMessages(req.params.sessionId);
        res.json({ success: true, messages });
    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).json({ success: false, message: "Failed to get messages" });
    }
};

exports.getUserSession = async (req, res) => {
    try {
        const session = await chatService.getUserSession(req.params.userId);
        res.json({ success: true, session });
    } catch (error) {
        console.error("Get User Session Error:", error);
        res.status(500).json({ success: false, message: "Failed to get session" });
    }
};

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await chatService.getAllSessions();
        res.json({ success: true, sessions });
    } catch (error) {
        console.error("Get All Sessions Error:", error);
        res.status(500).json({ success: false, message: "Failed to get sessions" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await chatService.markMessagesAsRead(req.params.sessionId);
        res.json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ success: false, message: "Failed to mark as read" });
    }
};

exports.updateSessionStatus = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        await chatService.updateSessionStatus(req.params.sessionId, status, assignedTo);
        res.json({ success: true, message: "Session status updated" });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await chatService.getUnreadCount(req.params.sessionId);
        res.json({ success: true, count });
    } catch (error) {
        console.error("Get Unread Error:", error);
        res.status(500).json({ success: false, message: "Failed to get unread count" });
    }
};
