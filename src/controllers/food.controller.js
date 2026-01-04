const foodService = require("../services/food.service");

/* =========================
   GET ALL FOODS (PUBLIC)
========================= */
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await foodService.getAllFoods();
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
    const foods = await foodService.getFoodsByCategory(category);
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
    const imagePath = `/uploads/seed/${req.file.filename}`;
    const food = await foodService.createFood(
      req.body,
      imagePath,
      req.user._id
    );
    res.status(201).json(food);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      message: error.message || "Failed to add food"
    });
  }
};

/* =========================
   UPDATE FOOD (ADMIN)
========================= */
exports.updateFood = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If new image uploaded, update image path
    if (req.file) {
      updateData.image = `/uploads/seed/${req.file.filename}`;
    }

    const food = await foodService.updateFood(req.params.id, updateData);
    res.json(food);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      message: error.message || "Failed to update food"
    });
  }
};

/* =========================
   DELETE FOOD (ADMIN)
========================= */
exports.deleteFood = async (req, res) => {
  try {
    const result = await foodService.deleteFood(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      message: error.message || "Failed to delete food"
    });
  }
};
