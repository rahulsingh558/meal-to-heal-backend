const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  basePrice: { type: Number, required: true },
  calories: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['veg', 'egg', 'nonveg'], 
    required: true 
  },
  category: { type: String, required: true },
  image: { type: String, required: true },
  defaultAddons: [addonSchema],  // Free addons
  extraAddons: [addonSchema]     // Premium addons
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);