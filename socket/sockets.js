const RoomController = require('../controllers/socket-room-controller')
const MessageController = require('../controllers/socket-message-controller')
const TypingController = require('../controllers/socket-typing-controller')

const sockets = (socket) => {
    console.log('connected')
    const roomController = new RoomController(socket)
    const messageController = new MessageController(socket)
    const typingController = new TypingController(socket)

    socket.on('room-join', roomController.joinRoom)
    socket.on('room-create', roomController.createRoom)
    socket.on('room-remove', roomController.roomRemoved)
    socket.on('unit-avail', roomController.availUnit)

    socket.on('typing-start', typingController.typingStarted)
    socket.on('typing-stop', typingController.typingStopped)

    socket.on('send-message', messageController.sendMessage)

    socket.on('disconnect', (socket) => {
        console.log('User left.')
    })
}

module.exports = sockets
