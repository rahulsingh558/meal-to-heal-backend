const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");

// Public routes
router.get("/", foodController.getAllFoods);
router.get("/category/:category", foodController.getFoodsByCategory);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  foodController.addFood
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  foodController.updateFood
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  foodController.deleteFood
);

module.exports = router;
