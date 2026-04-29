const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// GET /api/v1/hotels/search?city=Delhi
router.get('/search', hotelController.searchHotels);

module.exports = router;
