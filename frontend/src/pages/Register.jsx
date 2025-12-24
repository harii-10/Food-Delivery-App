import React, { useState, useEffect } from 'react';
import { authAPI, restaurantAPI } from '../services/api';

const Register = ({ onRegister, onSwitch }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    restaurantId: ''
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.role === 'RESTAURANT') {
      fetchRestaurants();
    }
  }, [formData.role]);

  const fetchRestaurants = async () => {
    try {
      const res = await restaurantAPI.getRestaurants();
      setRestaurants(res.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For restaurant owners, validate that a restaurant is selected
      if (formData.role === 'RESTAURANT' && !formData.restaurantId) {
        setError('Please select a restaurant to manage.');
        setLoading(false);
        return;
      }

      await authAPI.register(formData);
      onRegister();
    } catch (error) {
      setError('Registration failed. Email might already exist.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🍕 Join FoodieExpress!</h2>
          <p className="text-gray-600">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="USER">👤 Customer</option>
              <option value="RESTAURANT">🏪 Restaurant Owner</option>
            </select>
          </div>

          {formData.role === 'RESTAURANT' && (
            <div>
              <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Restaurant
              </label>
              <select
                id="restaurantId"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Choose a restaurant...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name} - {restaurant.cuisine}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select the restaurant you own and want to manage
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="text-primary hover:text-primary-dark font-medium hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;