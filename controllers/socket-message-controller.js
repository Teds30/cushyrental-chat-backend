const BaseController = require('./BaseController')
const Message = require('../models/message-schema')

module.exports = class MessageController extends BaseController {
    sendMessage = ({ message, sender_id, is_system, type, room_id }) => {
        const msg = new Message({
            message,
            sender_id,
            is_system,
            room_id,
            type,
            createdAt: new Date().toISOString(),
        })

        msg.save()

        // this.socket.emit('message-sent', { message: msg })
        let skt = this.socket.broadcast
        skt.to(room_id).emit('message-sent', { message: msg })
    }

    receiverSeen = async ({ room_id }) => {
        await Message.updateMany(
            {
                room_id: room_id,
            },
            { $set: { read: true } }
        )

        let skt = this.socket.broadcast
        skt.to(room_id).emit('receiver-seen')
    }
}
