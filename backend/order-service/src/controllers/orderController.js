const Order = require('../models/Order');
const axios = require('axios');

const createOrder = async (req, res) => {
  const { restaurantId, items, totalAmount } = req.body;
  try {
    const order = new Order({
      userId: req.user.id,
      restaurantId,
      items,
      totalAmount
    });
    await order.save();

    let paymentDetails = null;
    let deliveryDetails = null;

    // Try to process payment, but don't fail the order if payment service is down
    try {
      const paymentResponse = await axios.post('http://localhost:3005/api/payments', {
        orderId: order._id,
        amount: totalAmount
      }, { timeout: 5000 }); // 5 second timeout

      paymentDetails = {
        paymentId: paymentResponse.data._id,
        amount: paymentResponse.data.amount,
        status: paymentResponse.data.status,
        method: paymentResponse.data.method,
        createdAt: paymentResponse.data.createdAt
      };

      if (paymentResponse.data.status === 'SUCCESS') {
        order.status = 'CONFIRMED';
        await order.save();

        // Call delivery service
        try {
          const deliveryResponse = await axios.post('http://localhost:3004/api/deliveries', {
            orderId: order._id
          }, { timeout: 5000 });

          deliveryDetails = {
            deliveryId: deliveryResponse.data._id,
            status: deliveryResponse.data.status,
            estimatedTime: deliveryResponse.data.estimatedTime,
            deliveryPerson: deliveryResponse.data.deliveryPerson
          };
        } catch (deliveryError) {
          console.log('Delivery service unavailable, but order created');
        }

        // Call notification service
        try {
          await axios.post('http://localhost:3006/api/notifications', {
            userId: req.user.id,
            type: 'ORDER_STATUS',
            message: 'Order confirmed and payment processed'
          }, { timeout: 5000 });
        } catch (notificationError) {
          console.log('Notification service unavailable, but order created');
        }
      }
    } catch (paymentError) {
      console.log('Payment service unavailable, order created without payment processing');
      // Order is still created but remains in PLACED status
      // In a real app, you'd have a payment retry mechanism
    }

    // Create invoice details
    const invoice = {
      orderId: order._id,
      customerId: req.user.id,
      restaurantId: order.restaurantId,
      items: order.items,
      subtotal: order.totalAmount,
      tax: order.totalAmount * 0.08, // 8% tax
      deliveryFee: 2.99,
      total: order.totalAmount + (order.totalAmount * 0.08) + 2.99,
      paymentDetails,
      deliveryDetails,
      orderDate: order.createdAt,
      status: order.status
    };

    res.status(201).json({
      order,
      invoice,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order. Please try again.' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Notify user
    await axios.post('http://localhost:3006/api/notifications', {
      userId: order.userId,
      type: 'ORDER_STATUS',
      message: `Order status updated to ${status}`
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, updateOrderStatus };