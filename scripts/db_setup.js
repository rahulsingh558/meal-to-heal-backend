/**
 * DB SETUP SCRIPT
 * Run with: node scripts/db_setup.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Define the Addon schema
const addonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Define the Food schema
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
  defaultAddons: [addonSchema],
  extraAddons: [addonSchema]
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

// Addons configuration
const freeAddons = [
  { id: 1, name: 'Onion', price: 0 },
  { id: 2, name: 'Tomato', price: 0 },
  { id: 3, name: 'Cucumber', price: 0 },
  { id: 4, name: 'Lemon', price: 0 },
  { id: 5, name: 'Coriander', price: 0 },
];

const premiumAddonsVegEgg = [
  { id: 6, name: 'Sweet Corn', price: 20 },
  { id: 7, name: 'Broccoli', price: 25 },
  { id: 8, name: 'Beans', price: 15 },
  { id: 9, name: 'Peas', price: 15 },
  { id: 10, name: 'Spinach', price: 20 },
  { id: 15, name: 'Bell Pepper', price: 15 },
];

const premiumAddonsNonVeg = [
  { id: 11, name: 'Capsicum', price: 20 },
  { id: 12, name: 'Broccoli', price: 25 },
  { id: 13, name: 'Cheese', price: 30 },
  { id: 14, name: 'Mushroom', price: 25 },
  { id: 16, name: 'Bell Pepper', price: 15 },
];

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
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
  {
    name: 'Paneer Sprouts Bowl',
    subtitle: 'High Protein • Calcium Rich',
    basePrice: 120,
    calories: 420,
    type: 'veg',
    category: 'sprouts',
    image: '/uploads/seed/paneer-sprouts.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
  {
    name: 'Egg Sprouts Bowl',
    subtitle: 'Protein Boost • Energy Packed',
    basePrice: 110,
    calories: 380,
    type: 'egg',
    category: 'sprouts',
    image: '/uploads/seed/egg-sprouts.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
  {
    name: 'Chicken Sprouts Bowl',
    subtitle: 'Lean Protein • Muscle Fuel',
    basePrice: 150,
    calories: 450,
    type: 'nonveg',
    category: 'sprouts',
    image: '/uploads/seed/chicken-sprouts.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsNonVeg
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
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsNonVeg
  },
  {
    name: 'Air Fried Paneer',
    subtitle: 'Crunchy • Guilt Free',
    basePrice: 160,
    calories: 410,
    type: 'veg',
    category: 'airfried',
    image: '/uploads/seed/airfried-paneer.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
  {
    name: 'Air Fried Fish',
    subtitle: 'Omega-3 • Light & Tasty',
    basePrice: 190,
    calories: 460,
    type: 'nonveg',
    category: 'airfried',
    image: '/uploads/seed/airfried-fish.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsNonVeg
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
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsNonVeg
  },
  {
    name: 'Vegan Detox Bowl',
    subtitle: 'Clean • Green • Fresh',
    basePrice: 130,
    calories: 290,
    type: 'veg',
    category: 'sprouts',
    image: '/uploads/seed/vegan-detox.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
  {
    name: 'Low Carb Chicken Bowl',
    subtitle: 'Fat Loss Friendly',
    basePrice: 200,
    calories: 360,
    type: 'nonveg',
    category: 'airfried',
    image: '/uploads/seed/low-carb-chicken.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsNonVeg
  },
  {
    name: 'Egg White Fitness Bowl',
    subtitle: 'Lean Protein • Zero Guilt',
    basePrice: 140,
    calories: 310,
    type: 'egg',
    category: 'sprouts',
    image: '/uploads/seed/egg-white-bowl.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
  {
    name: 'Air Fried Veg Platter',
    subtitle: 'Colorful • Crunchy • Healthy',
    basePrice: 150,
    calories: 330,
    type: 'veg',
    category: 'airfried',
    image: '/uploads/seed/airfried-veg.png',
    defaultAddons: freeAddons,
    extraAddons: premiumAddonsVegEgg
  },
];

async function seedDB() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;

    console.log(process.env.MONGO_URI);

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { dbName: process.env.DBNAME });
    console.log('✅ MongoDB connected successfully');

    // Clear existing data
    console.log('🧹 Clearing existing food items...');
    await Food.deleteMany({});
    console.log('✅ Database cleared');

    // Insert new data
    console.log('🍽️ Inserting menu items...');
    const result = await Food.insertMany(foods);

    console.log(`✅ Successfully inserted ${result.length} food items`);

    // Display summary
    const vegCount = result.filter(f => f.type === 'veg').length;
    const eggCount = result.filter(f => f.type === 'egg').length;
    const nonvegCount = result.filter(f => f.type === 'nonveg').length;
    const sproutsCount = result.filter(f => f.category === 'sprouts').length;
    const airfriedCount = result.filter(f => f.category === 'airfried').length;

    console.log('\n📊 Insertion Summary:');
    console.log(`   Veg items: ${vegCount}`);
    console.log(`   Egg items: ${eggCount}`);
    console.log(`   Non-veg items: ${nonvegCount}`);
    console.log(`   Sprouts category: ${sproutsCount}`);
    console.log(`   Air Fried category: ${airfriedCount}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n👋 MongoDB disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ DB seeding failed:', err.message);

    // Detailed error logging
    if (err.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.keys(err.errors).forEach(field => {
        console.error(`  ${field}: ${err.errors[field].message}`);
      });
    }

    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedDB();