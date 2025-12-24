const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  deliveryPartnerId: { type: String, default: 'mock-partner-1' }, // mock
  status: { type: String, enum: ['ASSIGNED', 'PICKED_UP', 'DELIVERED'], default: 'ASSIGNED' },
  estimatedTime: { type: Number, default: 30 }, // minutes
  currentLocation: { lat: Number, lng: Number }, // mock
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);