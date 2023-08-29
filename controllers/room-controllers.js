const Room = require('../models/room-schema')
const Message = require('../models/message-schema')

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

const getRoomDetails = async (req, res, next) => {
    let room
    try {
        room = await Room.findOne({ _id: req.params.room_id })
    } catch (err) {
        console.log(err)
    }
    res.json(room)
}

getRoomMessages = async (req, res, next) => {
    let chats
    try {
        chats = await Message.find({ room_id: req.params.room_id, status: 1 })
        res.json(chats.map((chat) => chat.toObject({ getters: true })))
    } catch (err) {
        console.log(err)
    }
}

getRoomLastMessage = async (req, res, next) => {
    let chats
    try {
        chats = await Message.find({ room_id: req.params.room_id, status: 1 })
            .sort({ createdAt: -1 })
            .limit(1)
        res.json(chats.map((chat) => chat.toObject({ getters: true })))
    } catch (err) {
        console.log(err)
    }
}

getRoomMessagesCount = async (req, res, next) => {
    let chats

    try {
        chats = await Message.find({
            room_id: req.params.room_id,
            sender_id: { $ne: req.params.user_id },
            read: false,
            status: 1,
        }).count()
        res.json({ count: chats })
    } catch (err) {
        console.log(err)
    }
}

readMessages = async (req, res, next) => {
    try {
        await Message.updateMany(
            {
                room_id: req.params.room_id,
                sender_id: { $ne: req.body.user_id },
            },
            { $set: { read: true } }
        )
    } catch (err) {
        console.log(err)
    }
}

exports.getRooms = getRooms
exports.getRoomDetails = getRoomDetails
exports.getRoomMessages = getRoomMessages
exports.getRoomLastMessage = getRoomLastMessage
exports.getRoomMessagesCount = getRoomMessagesCount
exports.readMessages = readMessages
