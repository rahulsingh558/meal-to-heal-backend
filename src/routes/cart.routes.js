const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.put('/update/:itemId', cartController.updateItemQuantity);
router.delete('/remove/:itemId', cartController.removeItem);
router.delete('/clear', cartController.clearCart);
router.post('/merge', cartController.mergeCart);

module.exports = router;
