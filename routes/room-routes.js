const express = require('express')
const { check } = require('express-validator')

const router = express.Router()

const roomController = require('../controllers/room-controllers')

router.get('/rooms', roomController.getRooms)
router.post(
    '/rooms',
    [
        check('name').not().isEmpty(),
        check('user_id').not().isEmpty(),
        check('recipient_id').not().isEmpty(),
    ],
    roomController.createRoom
)

module.exports = router
