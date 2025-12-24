const express = require('express');
const { assignDelivery, getDeliveryStatus } = require('../controllers/deliveryController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', assignDelivery);
router.get('/:orderId', getDeliveryStatus);

module.exports = router;