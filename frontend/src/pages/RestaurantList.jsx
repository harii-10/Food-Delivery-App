import React, { useEffect, useState } from 'react';
import { restaurantAPI } from '../services/api';

const RestaurantList = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await restaurantAPI.getRestaurants();
        setRestaurants(res.data);
      } catch (error) {
        setError('Failed to load restaurants');
      }
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 text-lg">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🍴 Choose Your Favorite Restaurant</h2>
        <p className="text-gray-600">Discover amazing food from local restaurants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-card cursor-pointer"
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <div className="h-48 bg-gradient-to-br from-red-400 to-orange-500 rounded-t-xl flex items-center justify-center text-6xl text-white font-bold">
              {restaurant.name.charAt(0)}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">4.5</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  restaurant.isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1">📍</span>
                  {restaurant.address || 'Nearby'}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🕒</span>
                  {restaurant.cuisine}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">No restaurants available at the moment.</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new restaurants!</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;