const express = require('express')
const router = express.Router()

const notificationController = require('../controllers/notification-controllers')

router.post(
    '/notifications/token=:token',
    notificationController.sendNotification
)

module.exports = router
