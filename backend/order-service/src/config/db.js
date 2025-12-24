const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/orderDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected to orderDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;