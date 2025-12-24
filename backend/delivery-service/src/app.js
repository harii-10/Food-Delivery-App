const express = require('express');
const cors = require('cors');
const deliveryRoutes = require('./routes/delivery');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/deliveries', deliveryRoutes);

module.exports = app;