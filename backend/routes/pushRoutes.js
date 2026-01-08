const express = require('express');
const router = express.Router();
const pushController = require('../controllers/pushController');

// Push subscription endpoints
router.post('/subscribe', pushController.subscribe);
router.post('/unsubscribe', pushController.unsubscribe);
router.post('/test', pushController.sendTestNotification);
router.get('/stats', pushController.getStats);

module.exports = router;
