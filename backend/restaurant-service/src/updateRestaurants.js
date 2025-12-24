const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

async function updateRestaurants() {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaurantDB');

    // Update existing restaurants with a default ownerId
    // In a real app, you'd assign proper owner IDs
    const restaurants = await Restaurant.find({ ownerId: { $exists: false } });

    for (const restaurant of restaurants) {
      // For demo purposes, assign a dummy ownerId
      // In production, you'd have proper user management
      restaurant.ownerId = new mongoose.Types.ObjectId();
      await restaurant.save();
      console.log(`Updated restaurant: ${restaurant.name}`);
    }

    console.log('Restaurant update complete');
    process.exit(0);
  } catch (error) {
    console.error('Error updating restaurants:', error);
    process.exit(1);
  }
}

updateRestaurants();