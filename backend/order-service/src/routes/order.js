const express = require('express');
const { createOrder, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;