const Room = require('../models/room-schema')
const Message = require('../models/message-schema')
const fetch = require('node-fetch')

const createRoom = async (req, res, next) => {
    const { name, unit_id, landlord_id, tenant_id } = req.body
    let room
    try {
        room = await Room({
            name,
            unit_id,
            landlord_id,
            tenant_id,
        })

        room.save()
    } catch (err) {
        console.log(err)
    }

    res.json(room)
}
const getRooms = async (req, res, next) => {
    const { userId } = req.body
    let rooms
    try {
        rooms = await Room.find({
            $or: [{ landlord_id: userId }, { tenant_id: userId }],
        })
    } catch (err) {
        console.log(err)
    }

    // Now, you need to iterate through the 'rooms' array to get each room's '_id'.
    const roomIds = rooms.map((room) => room._id)

    // Use the 'roomIds' array to find messages for each room and count the messages.
    const roomMessageCounts = await Promise.all(
        roomIds.map(async (roomId) => {
            const messageCount = await Message.countDocuments({
                room_id: roomId,
            })
            return { roomId, messageCount }
        })
    )

    // Filter rooms with message counts greater than 0.
    const roomsWithMessageCounts = rooms.filter((room) => {
        const roomMessageCount = roomMessageCounts.find((item) =>
            item.roomId.equals(room._id)
        )
        return roomMessageCount && roomMessageCount.messageCount > 0
    })

    res.json({
        rooms: roomsWithMessageCounts.map((room) =>
            room.toObject({ getters: true })
        ),
    })
}

const getRoomDetails = async (req, res, next) => {
    let room
    try {
        room = await Room.findOne({ _id: req.params.room_id })
        if (room) {
            const tenant_query = await fetch(
                `http://127.0.0.1:8000/api/users/${room.tenant_id}`
            )
            const tenant_data = await tenant_query.json()
            const landlord_query = await fetch(
                `http://127.0.0.1:8000/api/users/${room.landlord_id}`
            )
            const landlord_data = await landlord_query.json()
            res.json({
                ...room._doc,
                tenant: tenant_data,
                landlord: landlord_data,
            })
        }
    } catch (err) {
        console.log(err)
    }
    // res.json(room)
}

const findExistingRoom = async (req, res, next) => {
    const { unit_id, tenant_id } = req.params
    let room
    try {
        room = await Room.findOne({ unit_id: unit_id, tenant_id: tenant_id })
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

exports.createRoom = createRoom
exports.getRooms = getRooms
exports.findExistingRoom = findExistingRoom
exports.getRoomDetails = getRoomDetails
exports.getRoomMessages = getRoomMessages
exports.getRoomLastMessage = getRoomLastMessage
exports.getRoomMessagesCount = getRoomMessagesCount
exports.readMessages = readMessages
