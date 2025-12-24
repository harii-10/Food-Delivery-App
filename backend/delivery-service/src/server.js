require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3004;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Delivery service running on port ${PORT}`);
  });
});