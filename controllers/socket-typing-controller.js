const BaseController = require('./BaseController')

module.exports = class TypingController extends BaseController {
    typingStarted = ({ room_id }) => {
        let skt = this.socket.broadcast
        skt.to(room_id).emit('typing-started')
    }
    typingStopped = ({ room_id }) => {
        let skt = this.socket.broadcast
        skt.to(room_id).emit('typing-stopped')
    }
}
