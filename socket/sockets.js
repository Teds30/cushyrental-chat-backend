const RoomController = require('../controllers/socket-room-controller')
const MessageController = require('../controllers/socket-message-controller')
const TypingController = require('../controllers/socket-typing-controller')
const fs = require('fs')

const sockets = (socket) => {
    console.log('connected')
    const roomController = new RoomController(socket)
    const messageController = new MessageController(socket)
    const typingController = new TypingController(socket)

    socket.on('room-join', roomController.joinRoom)
    socket.on('room-leave', roomController.leaveRoom)
    socket.on('room-create', roomController.createRoom)
    socket.on('room-remove', roomController.roomRemoved)
    socket.on('unit-avail', roomController.availUnit)

    socket.on('typing-start', typingController.typingStarted)
    socket.on('typing-stop', typingController.typingStopped)

    socket.on('send-message', messageController.sendMessage)
    socket.on('receiver-seen-signal', messageController.receiverSeen)

    socket.on('upload', ({ data, room_id }) => {
        fs.writeFile(
            'upload/' + 'test.png',
            data,
            { encoding: 'base64' },
            () => {}
        )
        socket.to(room_id).emit('uploaded', { buffer: data.toString('base64') })
        socket.emit('uploaded', { buffer: data.toString('base64') })
    })

    socket.on('disconnect', (socket) => {
        console.log('User left.')
    })
}

module.exports = sockets
