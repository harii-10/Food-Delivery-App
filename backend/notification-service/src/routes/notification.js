const express = require('express');
const { createNotification, getUserNotifications } = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', createNotification);
router.get('/', auth, getUserNotifications);

module.exports = router;