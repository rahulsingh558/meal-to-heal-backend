const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFO
    ========================== */
    name: {
      type: String,
      required: true,
      trim: true
    },

    subtitle: {
      type: String,
      default: "Healthy • Fresh • Protein-rich"
    },

    description: {
      type: String,
      default: ""
    },

    /* =========================
       PRICING
    ========================== */
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },

    calories: {
      type: Number,
      default: 0
    },

    /* =========================
       FOOD TYPE (FILTERS)
    ========================== */
    type: {
      type: String,
      enum: ["veg", "egg", "nonveg"],
      required: true
    },

    category: {
      type: String,
      default: "sprouts"
    },

    /* =========================
       IMAGE
    ========================== */
    image: {
      type: String,
      required: true
    },

    /* =========================
       STATUS
    ========================== */
    isAvailable: {
      type: Boolean,
      default: true
    },

    /* =========================
       ADMIN META
    ========================== */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);