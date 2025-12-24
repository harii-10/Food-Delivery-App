import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import RestaurantDashboard from './pages/RestaurantDashboard';
import { orderAPI } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        setPage('restaurants');
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('restaurants');
    setError('');
  };

  const handleRegister = () => {
    setPage('login');
    setError('');
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setPage('menu');
    setError('');
    setSidebarOpen(false);
  };

  const handleAddToCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing) {
      setCart(cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1, restaurantId: selectedRestaurant._id }]);
    }
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(c => c._id !== itemId));
    } else {
      setCart(cart.map(c => c._id === itemId ? { ...c, quantity } : c));
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const items = cart.map(item => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const response = await orderAPI.createOrder({ restaurantId: cart[0].restaurantId, items, totalAmount });

      // Show invoice modal or redirect to order confirmation
      alert(`Order placed successfully! Order ID: ${response.data.order._id.slice(-6)}`);
      setCart([]);
      setPage('tracking');
    } catch (error) {
      setError('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPage('login');
    setCart([]);
    setSelectedRestaurant(null);
    setError('');
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        {page === 'login' && <Login onLogin={handleLogin} onSwitch={() => setPage('register')} />}
        {page === 'register' && <Register onRegister={handleRegister} onSwitch={() => setPage('login')} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => setPage('restaurants')}>
                  🍕 FoodieExpress
                </div>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                className={`nav-link ${page === 'restaurants' ? 'active' : ''}`}
                onClick={() => setPage('restaurants')}
              >
                🏪 Restaurants
              </button>
              <button
                className={`nav-link ${page === 'cart' ? 'active' : ''}`}
                onClick={() => setPage('cart')}
              >
                🛒 Cart ({cart.length})
              </button>
              <button
                className={`nav-link ${page === 'tracking' ? 'active' : ''}`}
                onClick={() => setPage('tracking')}
              >
                📦 Orders
              </button>
              {user.role === 'RESTAURANT' && (
                <button
                  className={`nav-link ${page === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setPage('dashboard')}
                >
                  📊 Dashboard
                </button>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
              <button
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={toggleSidebar}></div>
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="text-xl font-bold text-primary">🍕 FoodieExpress</div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-6 space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                page === 'restaurants' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => { setPage('restaurants'); setSidebarOpen(false); }}
            >
              🏪 Restaurants
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                page === 'cart' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => { setPage('cart'); setSidebarOpen(false); }}
            >
              🛒 Cart ({cart.length})
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                page === 'tracking' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => { setPage('tracking'); setSidebarOpen(false); }}
            >
              📦 Orders
            </button>
            {user.role === 'RESTAURANT' && (
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  page === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => { setPage('dashboard'); setSidebarOpen(false); }}
              >
                📊 Dashboard
              </button>
            )}
            <button
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Processing...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {page === 'restaurants' && <RestaurantList onSelectRestaurant={handleSelectRestaurant} />}
            {page === 'menu' && selectedRestaurant && (
              <RestaurantMenu
                restaurant={selectedRestaurant}
                onAddToCart={handleAddToCart}
                onBack={() => setPage('restaurants')}
              />
            )}
            {page === 'cart' && (
              <Cart
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setPage('restaurants')}
              />
            )}
            {page === 'tracking' && <OrderTracking />}
            {page === 'dashboard' && <RestaurantDashboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">&copy; 2025 FoodieExpress. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;