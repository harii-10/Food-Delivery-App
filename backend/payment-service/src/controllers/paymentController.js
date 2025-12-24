const Payment = require('../models/Payment');

const processPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  try {
    const payment = new Payment({ orderId, amount });
    // Simulate success
    payment.status = 'SUCCESS';
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processPayment };