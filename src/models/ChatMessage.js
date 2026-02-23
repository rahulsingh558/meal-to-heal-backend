const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String
    },
    userPhone: {
        type: String
    },
    sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'resolved'],
        default: 'pending'
    },
    assignedTo: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ sender: 1, isRead: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
