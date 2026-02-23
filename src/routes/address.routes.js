const express = require('express');
const router = express.Router();

const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, addressController.getAddresses);
router.post('/', authMiddleware, addressController.addAddress);
router.put('/:index', authMiddleware, addressController.updateAddress);
router.delete('/:index', authMiddleware, addressController.deleteAddress);
router.patch('/:index/default', authMiddleware, addressController.setDefaultAddress);

module.exports = router;
