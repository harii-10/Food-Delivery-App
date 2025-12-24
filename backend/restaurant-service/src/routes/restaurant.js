const express = require('express');
const { createRestaurant, getRestaurants, getRestaurantMenu, updateMenu } = require('../controllers/restaurantController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, createRestaurant);
router.get('/', getRestaurants);
router.get('/:id/menu', getRestaurantMenu);
router.put('/:id/menu', auth, updateMenu);

module.exports = router;