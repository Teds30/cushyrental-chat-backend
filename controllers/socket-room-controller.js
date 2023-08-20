const BaseController = require('./BaseController')
const Room = require('../models/room-schema')
const fetch = require('node-fetch')

module.exports = class RoomController extends BaseController {
    joinRoom = ({ room_id }) => {
        console.log('joining room')
        this.socket.join(room_id)
        this.socket.emit('room-joined', { room_id })
    }

    createRoom = ({ name, unit_id, user_id, recipient_id }) => {
        const room = new Room({
            name,
            unit_id,
            participants: [
                {
                    user_id,
                },
                {
                    user_id: recipient_id,
                },
            ],
        })

        room.save()

        this.socket.emit('room-created', { room })
    }

    roomRemoved = async ({ room_id }) => {
        await Room.updateOne({ room_id, status: 0 })
        this.socket.emit('room-removed', { room_id })
    }

    availUnit = async ({ room_id, unit_id, request_status }) => {
        // this.socket.emit('message-sent', { message: msg })
        // let skt = this.socket.broadcast
        // skt.to(room_id).emit('message-sent', { message: msg })
        const unit_avail = await Room.findById(room_id)

        if (request_status === 'avail') {
            unit_avail.request_status = 'pending'
        }
        if (request_status === 'cancel') {
            unit_avail.request_status = ''
        }
        if (request_status === 'confirm') {
            unit_avail.request_status = 'confirmed'
        }
        if (request_status === 'reject') {
            unit_avail.request_status = 'rejected'
        }

        unit_avail.save()
        // this.socket.emit('unit-avail-accepted', {
        //     room_id,
        //     unit_id,
        //     request_status,
        // })
        // await Room.updateOne({ room_id, status: 0 })
    }
}
