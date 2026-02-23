const express = require('express');
const router = express.Router();
const mapplsController = require('../controllers/mapplsController');

router.get('/directions', mapplsController.getDrivingRoute);
router.get('/place-details', mapplsController.getPlaceDetails);

module.exports = router;
