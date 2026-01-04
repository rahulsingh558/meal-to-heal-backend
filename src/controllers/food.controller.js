const Food = require("../models/Food");

/* =========================
   GET ALL FOODS (PUBLIC)
========================= */
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch foods" });
  }
};

/* =========================
   GET FOOD BY CATEGORY
========================= */
exports.getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await Food.find({
      category,
      isAvailable: true
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch foods" });
  }
};

/* =========================
   ADD FOOD (ADMIN)
========================= */
exports.addFood = async (req, res) => {
  try {
    const food = await Food.create({
      name: req.body.name,
      subtitle: req.body.subtitle,
      basePrice: req.body.basePrice,
      calories: req.body.calories,
      type: req.body.type,
      category: req.body.category,
      image: `/uploads/seed/${req.file.filename}`,
      createdBy: req.user._id
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: "Failed to add food" });
  }
};

/* =========================
   UPDATE FOOD (ADMIN)
========================= */
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(food);
  } catch (error) {
    res.status(400).json({ message: "Failed to update food" });
  }
};

/* =========================
   DELETE FOOD (ADMIN)
========================= */
exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete food" });
  }
};