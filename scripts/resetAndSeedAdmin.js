require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User");
const Food = require("../src/models/Food"); // optional, if exists

const MONGO_URI = process.env.MONGO_URI;

const resetAndSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // 🔥 DELETE EVERYTHING (careful!)
    await User.deleteMany({});
    console.log("Users collection cleared");

    if (Food) {
      await Food.deleteMany({});
      console.log("Foods collection cleared");
    }

    // 🔐 CREATE ADMIN USER
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@mealtoheal.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin user created:");
    console.log({
      email: adminUser.email,
      password: "admin123",
      role: adminUser.role
    });

    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
};

resetAndSeed();