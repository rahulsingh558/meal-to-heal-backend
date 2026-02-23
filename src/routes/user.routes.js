const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.put("/password", userController.updatePassword);

module.exports = router;
