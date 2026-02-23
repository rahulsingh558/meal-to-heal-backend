const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Statistics and analytics routes (MUST BE BEFORE /:id route)
router.get('/stats/summary', orderController.getOrderStats);
router.get('/stats/revenue', orderController.getRevenueData);
router.get('/stats/best-selling', orderController.getBestSellingItems);

// CRUD routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

// Status update
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
