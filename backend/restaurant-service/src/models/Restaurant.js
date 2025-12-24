const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: {
    lat: Number,
    lng: Number
  },
  address: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

restaurantSchema.index({ 'location': '2dsphere' }); // for geo queries

module.exports = mongoose.model('Restaurant', restaurantSchema);