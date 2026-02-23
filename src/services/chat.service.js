const ChatMessage = require("../models/ChatMessage");

class ChatService {
    async sendMessage({ sessionId, userId, userName, userEmail, userPhone, sender, content, assignedTo, status }) {
        const message = await ChatMessage.create({
            sessionId, userId, userName, userEmail, userPhone, sender, content,
            isRead: sender === 'user' ? false : true,
            status: status || 'pending',
            assignedTo
        });
        return message;
    }

    async getSessionMessages(sessionId) {
        return await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
    }

    async getAllSessions() {
        const sessions = await ChatMessage.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$sessionId",
                    userId: { $first: "$userId" },
                    userName: { $first: "$userName" },
                    userEmail: { $first: "$userEmail" },
                    userPhone: { $first: "$userPhone" },
                    lastMessage: { $first: "$content" },
                    lastActive: { $first: "$createdAt" },
                    status: { $first: "$status" },
                    assignedTo: { $first: "$assignedTo" },
                    messages: { $push: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$sender", "user"] }, { $eq: ["$isRead", false] }] },
                                1, 0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    sessionId: "$_id", userId: 1, userName: 1, userEmail: 1, userPhone: 1,
                    lastMessage: 1, lastActive: 1, status: 1, assignedTo: 1,
                    messageCount: { $size: "$messages" }, unreadCount: 1, _id: 0
                }
            },
            { $sort: { lastActive: -1 } }
        ]);
        return sessions;
    }

    async markMessagesAsRead(sessionId, sender = 'user') {
        return await ChatMessage.updateMany(
            { sessionId, sender, isRead: false },
            { $set: { isRead: true } }
        );
    }

    async updateSessionStatus(sessionId, status, assignedTo) {
        const updateData = { status };
        if (assignedTo) updateData.assignedTo = assignedTo;
        return await ChatMessage.updateMany({ sessionId }, { $set: updateData });
    }

    async getUnreadCount(sessionId = null) {
        const query = { sender: 'user', isRead: false };
        if (sessionId) query.sessionId = sessionId;
        return await ChatMessage.countDocuments(query);
    }

    async getUserSession(userId) {
        const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 }).lean();
        if (messages.length === 0) return null;
        return {
            sessionId: messages[0].sessionId,
            userId,
            userName: messages[0].userName,
            messages
        };
    }
}

module.exports = new ChatService();
