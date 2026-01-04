/**
 * DB SETUP SCRIPT
 * Run with: node scripts/db_setup.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Food = require('../src/models/Food');

const foods = [
  /* ======================
     SPROUTS
  ====================== */
  {
    name: 'Moong Sprouts Bowl',
    subtitle: 'Healthy • Fresh • Protein-rich',
    basePrice: 80,
    calories: 320,
    type: 'veg',
    category: 'sprouts',
    image: '/uploads/seed/moong-sprouts.png',
    isAvailable: true,
  },
  {
    name: 'Paneer Sprouts Bowl',
    subtitle: 'High Protein • Calcium Rich',
    basePrice: 120,
    calories: 420,
    type: 'veg',
    category: 'sprouts',
    image: '/uploads/seed/paneer-sprouts.png',
    isAvailable: true,
  },
  {
    name: 'Egg Sprouts Bowl',
    subtitle: 'Protein Boost • Energy Packed',
    basePrice: 110,
    calories: 380,
    type: 'egg',
    category: 'sprouts',
    image: '/uploads/seed/egg-sprouts.png',
    isAvailable: true,
  },
  {
    name: 'Chicken Sprouts Bowl',
    subtitle: 'Lean Protein • Muscle Fuel',
    basePrice: 150,
    calories: 450,
    type: 'nonveg',
    category: 'sprouts',
    image: '/uploads/seed/chicken-sprouts.png',
    isAvailable: true,
  },

  /* ======================
     AIR FRIED
  ====================== */
  {
    name: 'Air Fried Chicken',
    subtitle: 'Crispy • Low Oil • High Protein',
    basePrice: 180,
    calories: 480,
    type: 'nonveg',
    category: 'airfried',
    image: '/uploads/seed/airfried-chicken.png',
    isAvailable: true,
  },
  {
    name: 'Air Fried Paneer',
    subtitle: 'Crunchy • Guilt Free',
    basePrice: 160,
    calories: 410,
    type: 'veg',
    category: 'airfried',
    image: '/uploads/seed/airfried-paneer.png',
    isAvailable: true,
  },
  {
    name: 'Air Fried Fish',
    subtitle: 'Omega-3 • Light & Tasty',
    basePrice: 190,
    calories: 460,
    type: 'nonveg',
    category: 'airfried',
    image: '/uploads/seed/airfried-fish.png',
    isAvailable: true,
  },

  /* ======================
     SPECIALS
  ====================== */
  {
    name: 'Protein Power Bowl',
    subtitle: 'Ultimate Muscle Meal',
    basePrice: 220,
    calories: 520,
    type: 'nonveg',
    category: 'sprouts',
    image: '/uploads/seed/protein-bowl.png',
    isAvailable: true,
  },
  {
    name: 'Vegan Detox Bowl',
    subtitle: 'Clean • Green • Fresh',
    basePrice: 130,
    calories: 290,
    type: 'veg',
    category: 'sprouts',
    image: '/uploads/seed/vegan-detox.png',
    isAvailable: true,
  },
  {
    name: 'Low Carb Chicken Bowl',
    subtitle: 'Fat Loss Friendly',
    basePrice: 200,
    calories: 360,
    type: 'nonveg',
    category: 'airfried',
    image: '/uploads/seed/low-carb-chicken.png',
    isAvailable: true,
  },
  {
    name: 'Egg White Fitness Bowl',
    subtitle: 'Lean Protein • Zero Guilt',
    basePrice: 140,
    calories: 310,
    type: 'egg',
    category: 'sprouts',
    image: '/uploads/seed/egg-white-bowl.png',
    isAvailable: true,
  },
  {
    name: 'Air Fried Veg Platter',
    subtitle: 'Colorful • Crunchy • Healthy',
    basePrice: 150,
    calories: 330,
    type: 'veg',
    category: 'airfried',
    image: '/uploads/seed/airfried-veg.png',
    isAvailable: true,
  },
];

async function seedDB() {
  try {
    await connectDB();

    console.log('🧹 Clearing existing food items...');
    await Food.deleteMany({});

    console.log('🍽️ Inserting menu items...');
    await Food.insertMany(foods);

    console.log(`✅ Successfully inserted ${foods.length} food items`);
    process.exit(0);
  } catch (err) {
    console.error('❌ DB seeding failed:', err);
    process.exit(1);
  }
}

seedDB();