const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:4200', 
      'http://localhost:4000',
      process.env.CLIENT_URL // Production frontend URL
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join delivery tracking room
  socket.on('join-delivery', (orderId) => {
    socket.join(`delivery-${orderId}`);
    console.log(`📦 Socket ${socket.id} joined delivery-${orderId}`);
  });

  // Leave delivery tracking room
  socket.on('leave-delivery', (orderId) => {
    socket.leave(`delivery-${orderId}`);
    console.log(`📦 Socket ${socket.id} left delivery-${orderId}`);
  });

  // Update delivery location
  socket.on('update-location', (data) => {
    io.to(`delivery-${data.orderId}`).emit('location-update', data);
  });

  // Chat rooms
  socket.on('join-chat', (sessionId) => {
    socket.join(`chat-${sessionId}`);
    console.log(`💬 Socket ${socket.id} joined chat-${sessionId}`);
  });

  socket.on('leave-chat', (sessionId) => {
    socket.leave(`chat-${sessionId}`);
  });

  socket.on('chat-message', (data) => {
    io.to(`chat-${data.sessionId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Connect DB & Start Server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Meal to Heal server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });