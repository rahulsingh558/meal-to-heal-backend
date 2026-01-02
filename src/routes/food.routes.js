const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");

// Public
router.get("/", foodController.getAllFoods);

// Admin
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  foodController.addFood
);

module.exports = router;