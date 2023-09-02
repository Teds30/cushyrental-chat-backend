const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

const roomController = require('../controllers/room-controllers')
const landlordController = require('../controllers/landlord-controllers')

router.get('/rooms', roomController.getRooms)
router.get('/rooms/:room_id', roomController.getRoomDetails)
router.get('/chats/:room_id', roomController.getRoomMessages)
router.get('/last-chat/:room_id', roomController.getRoomLastMessage)
router.get(
    '/chats-count/:room_id/:user_id',
    roomController.getRoomMessagesCount
)
router.patch('/read-chats/:room_id', roomController.readMessages)

router.get('/inquiries/:landlord_id', landlordController.getInquiries)

module.exports = router
