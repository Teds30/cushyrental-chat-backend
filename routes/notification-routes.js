const express = require('express')
const router = express.Router()

const notificationController = require('../controllers/notification-controllers')

router.post('/notifications', notificationController.sendNotification)

module.exports = router
