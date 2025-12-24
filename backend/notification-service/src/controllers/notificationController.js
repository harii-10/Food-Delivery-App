const Notification = require('../models/Notification');

const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;
  try {
    const notification = new Notification({ userId, type, message });
    await notification.save();
    // In real app, send email/SMS/push
    console.log(`Notification sent: ${message}`);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNotification, getUserNotifications };