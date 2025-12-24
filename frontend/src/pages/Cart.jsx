import React from 'react';

const Cart = ({ cart, onUpdateQuantity, onPlaceOrder, onBack }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart</h2>
          <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          className="btn-secondary flex items-center space-x-2"
          onClick={onBack}
        >
          <span>←</span>
          <span>Continue Shopping</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-600">Add some delicious items from our restaurants!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <button
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} total</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">${total.toFixed(2)}</div>
                <p className="text-sm text-gray-500">Plus taxes and delivery</p>
              </div>
            </div>
          </div>

          <button
            className="btn-primary w-full py-4 text-xl font-semibold flex items-center justify-center space-x-2"
            onClick={onPlaceOrder}
          >
            <span>🛍️</span>
            <span>Place Order</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;