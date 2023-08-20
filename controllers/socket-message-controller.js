const BaseController = require('./BaseController')
const Message = require('../models/message-schema')

module.exports = class MessageController extends BaseController {
    sendMessage = ({ message, sender_id, room_id }) => {
        const msg = new Message({
            message,
            sender_id,
            room_id,
        })

        // msg.save()

        this.socket.emit('message-sent', { message: msg })
        let skt = this.socket.broadcast
        skt.to(room_id).emit('message-sent', { message: msg })
    }
}
