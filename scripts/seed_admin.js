require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

const MONGO_URI = process.env.MONGO_URI;

async function seedAdminUser() {
    try {
        // Connect to MongoDB with the same database name as the server
        await mongoose.connect(MONGO_URI, {
            dbName: process.env.DBNAME
        });
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@mealtoheal.com" });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists:");
            console.log("   Email: admin@mealtoheal.com");
            console.log("   Role:", existingAdmin.role);

            // Update to admin role if not already
            if (existingAdmin.role !== "admin") {
                existingAdmin.role = "admin";
                await existingAdmin.save();
                console.log("✅ Updated user role to admin");
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash("admin123", 10);

            const admin = await User.create({
                name: "Admin User",
                email: "admin@mealtoheal.com",
                password: hashedPassword,
                role: "admin"
            });

            console.log("✅ Admin user created successfully!");
            console.log("   Email: admin@mealtoheal.com");
            console.log("   Password: admin123");
            console.log("   Role:", admin.role);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
        process.exit(1);
    }
}

console.log("🌱 Seeding admin user...\n");
seedAdminUser();
