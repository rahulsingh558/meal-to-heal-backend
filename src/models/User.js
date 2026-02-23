const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"]
    },
    password: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    // OAuth Fields
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    provider: {
      type: String,
      enum: ["local", "google", "whatsapp"],
      default: "local"
    },
    profilePicture: {
      type: String
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    customerPhone: {
      type: String
    },
    addresses: [{
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      addressLine1: {
        type: String,
        required: true
      },
      addressLine2: {
        type: String
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      landmark: {
        type: String
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);