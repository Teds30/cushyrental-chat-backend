const Room = require('../models/room-schema')

const getRooms = async (req, res, next) => {
    let rooms
    try {
        rooms = await Room.find({})
    } catch (err) {
        console.log(err)
    }
    res.json({
        rooms: rooms.map((room) => room.toObject({ getters: true })),
    })
}

const createRoom = async (req, res, next) => {
    const { name, user_id, recipient_id } = req.params

    const room = new Room({
        name,
        participants: [
            {
                user_id,
            },
            {
                recipient_id,
            },
        ],
    })

    const response = await room.save()

    res.status(201).json({
        message: 'Room Created',
        car: room,
    })
    this.socket.emit('new-room-created', { room })
}

exports.getRooms = getRooms
exports.createRoom = createRoom
