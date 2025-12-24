import React, { useEffect, useState } from 'react';
import { restaurantAPI } from '../services/api';

const RestaurantMenu = ({ restaurant, onAddToCart, onBack }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await restaurantAPI.getMenu(restaurant._id);
        setMenu(res.data);
      } catch (error) {
        setError('Failed to load menu');
      }
      setLoading(false);
    };
    fetchMenu();
  }, [restaurant]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 text-lg">Loading menu...</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name} Menu</h2>
          <p className="text-gray-600">{restaurant.description}</p>
        </div>
        <button
          className="btn-secondary flex items-center space-x-2"
          onClick={onBack}
        >
          <span>←</span>
          <span>Back to Restaurants</span>
        </button>
      </div>

      {menu && menu.items && menu.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.items.map((item) => (
            <div key={item._id} className="menu-item-card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h4>
                  <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.category || 'General'}
                    </span>
                    <span className={`text-sm font-medium ${
                      item.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.isAvailable ? '✓ Available' : '✗ Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary mb-3">
                    ${item.price.toFixed(2)}
                  </div>
                  <button
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onAddToCart(item)}
                    disabled={!item.isAvailable}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">No menu items available.</p>
          <p className="text-gray-400 text-sm mt-2">The restaurant is updating their menu.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;