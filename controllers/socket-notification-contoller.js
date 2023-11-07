const BaseController = require('./BaseController')

module.exports = class NotificationController extends BaseController {
    joinRoom = ({ user_id }) => {
        this.socket.join(user_id)
        this.socket.emit('notification-joined', { user_id })
    }
}
