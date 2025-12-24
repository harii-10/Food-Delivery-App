const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');
const Menu = require('./src/models/Menu');

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaurantDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Create restaurants
    const restaurants = [
      {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizzas with fresh ingredients',
        location: { lat: 40.7128, lng: -74.0060 },
        address: '123 Main St, New York',
        ownerId: '507f1f77bcf86cd799439011', // mock
        isOpen: true
      },
      {
        name: 'Burger Barn',
        description: 'Juicy burgers and crispy fries',
        location: { lat: 40.7129, lng: -74.0061 },
        address: '456 Oak Ave, New York',
        ownerId: '507f1f77bcf86cd799439012',
        isOpen: true
      },
      {
        name: 'Sushi Spot',
        description: 'Fresh sushi and Japanese cuisine',
        location: { lat: 40.7130, lng: -74.0062 },
        address: '789 Pine St, New York',
        ownerId: '507f1f77bcf86cd799439013',
        isOpen: true
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);

    // Create menus
    const menus = [
      {
        restaurantId: createdRestaurants[0]._id,
        name: 'Pizza Menu',
        description: 'Our delicious pizza selection',
        items: [
          {
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomato sauce, basil',
            price: 12.99,
            category: 'Pizza',
            isAvailable: true
          },
          {
            name: 'Pepperoni Pizza',
            description: 'Pepperoni, mozzarella, tomato sauce',
            price: 14.99,
            category: 'Pizza',
            isAvailable: true
          },
          {
            name: 'Garlic Bread',
            description: 'Toasted bread with garlic butter',
            price: 5.99,
            category: 'Sides',
            isAvailable: true
          }
        ]
      },
      {
        restaurantId: createdRestaurants[1]._id,
        name: 'Burger Menu',
        description: 'Classic burgers and more',
        items: [
          {
            name: 'Classic Burger',
            description: 'Beef patty, lettuce, tomato, cheese',
            price: 9.99,
            category: 'Burgers',
            isAvailable: true
          },
          {
            name: 'Cheese Burger',
            description: 'Beef patty with extra cheese',
            price: 10.99,
            category: 'Burgers',
            isAvailable: true
          },
          {
            name: 'French Fries',
            description: 'Crispy golden fries',
            price: 3.99,
            category: 'Sides',
            isAvailable: true
          }
        ]
      },
      {
        restaurantId: createdRestaurants[2]._id,
        name: 'Sushi Menu',
        description: 'Fresh sushi selection',
        items: [
          {
            name: 'California Roll',
            description: 'Crab, avocado, cucumber',
            price: 8.99,
            category: 'Rolls',
            isAvailable: true
          },
          {
            name: 'Salmon Nigiri',
            description: 'Fresh salmon over rice',
            price: 6.99,
            category: 'Nigiri',
            isAvailable: true
          },
          {
            name: 'Miso Soup',
            description: 'Traditional Japanese soup',
            price: 3.99,
            category: 'Soups',
            isAvailable: true
          }
        ]
      }
    ];

    await Menu.insertMany(menus);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();