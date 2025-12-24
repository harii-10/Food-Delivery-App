import React, { useEffect, useState } from 'react';
import { orderAPI, deliveryAPI } from '../services/api';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getOrders();
        setOrders(res.data);
      } catch (error) {
        setError('Failed to load orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleTrack = async (order) => {
    try {
      const res = await deliveryAPI.getStatus(order._id);
      setSelectedOrder({ ...order, delivery: res.data });
    } catch (error) {
      setError('Failed to load delivery status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PLACED: 'status-pending',
      CONFIRMED: 'status-confirmed',
      PREPARING: 'status-preparing',
      OUT_FOR_DELIVERY: 'status-ready',
      DELIVERED: 'status-delivered'
    };
    return colors[status] || 'status-pending';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your orders...</p>
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h2>
        <p className="text-gray-600">Track your food orders and delivery status</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-600">Start exploring restaurants and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="btn-secondary flex items-center space-x-2"
                  onClick={() => handleTrack(order)}
                >
                  <span>📍</span>
                  <span>Track Order</span>
                </button>

                {order.invoice && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Payment:</span> {order.invoice.paymentMethod} - {order.invoice.paymentStatus}
                  </div>
                )}
              </div>

              {selectedOrder && selectedOrder._id === order._id && selectedOrder.delivery && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">🚚</span>
                    Delivery Status
                  </h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><span className="font-medium">Status:</span> {selectedOrder.delivery.status.replace('_', ' ')}</p>
                    {selectedOrder.delivery.estimatedTime && (
                      <p><span className="font-medium">Estimated time:</span> {selectedOrder.delivery.estimatedTime} minutes</p>
                    )}
                    {selectedOrder.delivery.driverName && (
                      <p><span className="font-medium">Driver:</span> {selectedOrder.delivery.driverName}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;