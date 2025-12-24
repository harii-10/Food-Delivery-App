const Delivery = require('../models/Delivery');
const axios = require('axios');

const assignDelivery = async (req, res) => {
  const { orderId } = req.body;
  try {
    const delivery = new Delivery({ orderId });
    await delivery.save();

    // Simulate delivery progress
    setTimeout(async () => {
      delivery.status = 'PICKED_UP';
      await delivery.save();
      await axios.put(`http://localhost:3003/api/orders/${orderId}/status`, { status: 'OUT_FOR_DELIVERY' });
    }, 10000); // 10 seconds

    setTimeout(async () => {
      delivery.status = 'DELIVERED';
      await delivery.save();
      await axios.put(`http://localhost:3003/api/orders/${orderId}/status`, { status: 'DELIVERED' });
    }, 20000); // 20 seconds

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeliveryStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const delivery = await Delivery.findOne({ orderId });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignDelivery, getDeliveryStatus };