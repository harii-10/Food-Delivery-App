const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

const createRestaurant = async (req, res) => {
  const { name, description, location, address } = req.body;
  try {
    const restaurant = new Restaurant({
      name,
      description,
      location,
      address,
      ownerId: req.user.id
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isOpen: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const menu = await Menu.findOne({ restaurantId: id });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, description, items } = req.body;
  try {
    const menu = await Menu.findOneAndUpdate(
      { restaurantId: id },
      { name, description, items },
      { new: true, upsert: true }
    );
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRestaurant, getRestaurants, getRestaurantMenu, updateMenu };