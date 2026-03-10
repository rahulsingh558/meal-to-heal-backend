const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("./config/passport");
const session = require("express-session");

const app = express();

// Default CORS origin
const allowedOrigins = [
  'http://localhost:4200', 
  'http://localhost:4000',
  process.env.CLIENT_URL // Add production frontend URL from environment
].filter(Boolean); // removes undefined if CLIENT_URL is not set

// CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (needed for Passport)
app.use(session({
  secret: process.env.JWT_SECRET || 'meal-to-heal-secret',
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const chatRoutes = require("./routes/chat.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");
const addressRoutes = require("./routes/address.routes");
const userRoutes = require("./routes/user.routes");
const mapplsRoutes = require("./routes/mapplsRoutes");
const carouselRoutes = require("./routes/carousel.routes");

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/mappls", mapplsRoutes);
app.use("/api/carousel", carouselRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Meal-to-Heal API running" });
});

module.exports = app;