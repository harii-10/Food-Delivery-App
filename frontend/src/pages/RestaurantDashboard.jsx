import React, { useEffect, useState } from 'react';
import { restaurantAPI, orderAPI } from '../services/api';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      // Get user info from token to find restaurant
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const userRestaurantId = payload.restaurantId;

      if (userRestaurantId) {
        // Get the specific restaurant for this user
        const restaurantsRes = await restaurantAPI.getRestaurants();
        const userRestaurant = restaurantsRes.data.find(r => r._id === userRestaurantId);

        if (userRestaurant) {
          setRestaurant(userRestaurant);
          // Get menu for this restaurant
          try {
            const menuRes = await restaurantAPI.getMenu(userRestaurant._id);
            setMenuItems(menuRes.data?.items || []);
          } catch (menuError) {
            console.log('Menu not found, starting with empty menu');
            setMenuItems([]);
          }

          // Get orders for this restaurant
          const ordersRes = await orderAPI.getOrders();
          const restaurantOrders = ordersRes.data.filter(order => order.restaurantId === userRestaurant._id);
          setOrders(restaurantOrders);
        } else {
          setError('Restaurant not found. Please contact support.');
        }
      } else {
        setError('No restaurant assigned to your account. Please contact support.');
      }
    } catch (error) {
      setError('Failed to load restaurant data');
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const newMenuItem = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        isAvailable: true
      };
      const updatedMenu = [...menuItems, newMenuItem];
      await restaurantAPI.updateMenu(restaurant._id, {
        name: `${restaurant.name} Menu`,
        description: `Menu for ${restaurant.name}`,
        items: updatedMenu
      });
      setMenuItems(updatedMenu);
      setNewItem({ name: '', description: '', price: '', category: '' });
      // Refresh the data to get the updated menu with proper IDs
      await fetchRestaurantData();
    } catch (error) {
      setError('Failed to add menu item');
      console.error('Add menu item error:', error);
    }
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const updatedMenu = menuItems.map(item =>
        item._id === editingItem._id ? {
          ...editingItem,
          price: parseFloat(editingItem.price),
          isAvailable: editingItem.isAvailable !== undefined ? editingItem.isAvailable : true
        } : item
      );
      await restaurantAPI.updateMenu(restaurant._id, {
        name: `${restaurant.name} Menu`,
        description: `Menu for ${restaurant.name}`,
        items: updatedMenu
      });
      setMenuItems(updatedMenu);
      setEditingItem(null);
      // Refresh the data
      await fetchRestaurantData();
    } catch (error) {
      setError('Failed to update menu item');
      console.error('Update menu item error:', error);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    try {
      const updatedMenu = menuItems.filter(item => item._id !== itemId);
      await restaurantAPI.updateMenu(restaurant._id, {
        name: `${restaurant.name} Menu`,
        description: `Menu for ${restaurant.name}`,
        items: updatedMenu
      });
      setMenuItems(updatedMenu);
      // Refresh the data
      await fetchRestaurantData();
    } catch (error) {
      setError('Failed to delete menu item');
      console.error('Delete menu item error:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your restaurant...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
        Restaurant not found. Please contact support.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏪 {restaurant.name} Dashboard</h1>
        <p className="text-gray-600 text-lg">Manage your restaurant and orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'orders'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders ({orders.length})
          </button>
          <button
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'menu'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            🍽️ Menu ({menuItems.length})
          </button>
          <button
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>
      </div>

      <div className="card">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👨‍🍳</div>
                <p className="text-gray-600 text-lg">No orders yet. Great job keeping the kitchen ready!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Customer:</span> {order.userId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total:</span> ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Items:</span> {order.items.length}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {order.status === 'PLACED' && (
                        <button
                          className="btn-primary w-full"
                          onClick={() => updateOrderStatus(order._id, 'CONFIRMED')}
                        >
                          ✅ Confirm Order
                        </button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button
                          className="btn-primary w-full"
                          onClick={() => updateOrderStatus(order._id, 'PREPARING')}
                        >
                          👨‍🍳 Start Preparing
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button
                          className="btn-primary w-full"
                          onClick={() => updateOrderStatus(order._id, 'OUT_FOR_DELIVERY')}
                        >
                          🚚 Ready for Delivery
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
              <button
                className="btn-primary flex items-center space-x-2"
                onClick={() => setEditingItem({ name: '', description: '', price: '', category: '' })}
              >
                <span>➕</span>
                <span>Add New Item</span>
              </button>
            </div>

            {editingItem && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {editingItem._id ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <form onSubmit={editingItem._id ? handleUpdateMenuItem : handleAddMenuItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        placeholder="e.g., Main Course, Appetizer"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      rows="3"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button type="submit" className="btn-primary">
                      {editingItem._id ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>
                      <p className="text-primary font-medium text-sm mb-2">{item.category}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                        onClick={() => setEditingItem(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                        onClick={() => handleDeleteMenuItem(item._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Restaurant Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <h3 className="text-gray-600 font-medium mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-primary">{orders.length}</p>
              </div>
              <div className="card text-center">
                <h3 className="text-gray-600 font-medium mb-2">Revenue</h3>
                <p className="text-3xl font-bold text-primary">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
              <div className="card text-center">
                <h3 className="text-gray-600 font-medium mb-2">Menu Items</h3>
                <p className="text-3xl font-bold text-primary">{menuItems.length}</p>
              </div>
              <div className="card text-center">
                <h3 className="text-gray-600 font-medium mb-2">Avg Order Value</h3>
                <p className="text-3xl font-bold text-primary">
                  ${orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;