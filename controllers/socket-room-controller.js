const BaseController = require('./BaseController')
const Room = require('../models/room-schema')
const Message = require('../models/message-schema')
const fetch = require('node-fetch')

module.exports = class RoomController extends BaseController {
    sendMessage = ({ message, is_system, room_id }) => {
        const msg = new Message({
            message: message,
            is_system,
            room_id: room_id,
            read: false,
        })

        msg.save()

        this.socket.emit('message-sent', { message: msg })
        let skt = this.socket.broadcast
        skt.to(room_id).emit('message-sent', { message: msg })
    }

    joinRoom = ({ room_id }) => {
        console.log('joining room')
        this.socket.join(room_id)
        this.socket.emit('room-joined', { room_id })
        this.socket.broadcast.to(room_id).emit('room-joined', { room_id })
    }

    leaveRoom = ({ room_id }) => {
        console.log('leaving room')
        this.socket.leave(room_id)
        this.socket.emit('room-left', { room_id })
        this.socket.broadcast.to(room_id).emit('room-left', { room_id })
    }

    createRoom = ({ name, unit_id, landlord_id, tenant_id }) => {
        const room = new Room({
            name,
            unit_id,
            landlord_id,
            tenant_id,
        })

        room.save()

        this.socket.emit('room-created', { room })
    }

    roomRemoved = async ({ room_id }) => {
        await Room.updateOne({ room_id, status: 0 })
        this.socket.emit('room-removed', { room_id })
    }

    availUnit = async ({
        room_id,
        slots,
        unit_name = '',
        request_status,
        name,
        user_id = null,
    }) => {
        // this.socket.emit('message-sent', { message: msg })
        // let skt = this.socket.broadcast
        // skt.to(room_id).emit('message-sent', { message: msg })
        const unit_avail = await Room.findById(room_id)

        if (request_status === 'avail') {
            unit_avail.request_status = 'pending'
            unit_avail.slots = slots

            this.socket.broadcast.to(room_id).emit('unit-avail-pending')
            this.socket.emit('unit-avail-pending')

            this.socket.broadcast.to(user_id).emit('notification-update')

            this.sendMessage({
                message: `${name} requested to avail the unit.`,
                is_system: true,
                room_id,
            })

            this.sendNotification({
                redirect_url: `/chats/${room_id}`,
                title: 'Request to Avail',
                message: `${name} requested to avail ${unit_name}. Check your message now!`,
                room_id,
                user_id: user_id,
            })
        }
        if (request_status === 'cancel') {
            unit_avail.request_status = ''
            unit_avail.slots = 0
            this.socket.broadcast.to(room_id).emit('unit-avail')
            this.socket.emit('unit-avail')

            this.sendMessage({
                message: `${name} canceled to avail the unit.`,
                is_system: true,
                room_id,
            })
        }
        if (request_status === 'accept') {
            unit_avail.request_status = 'accepted'
            this.socket.broadcast.to(room_id).emit('unit-avail-accepted')
            this.socket.emit('unit-avail-accepted')
            this.socket.broadcast.to(user_id).emit('notification-update')

            this.sendMessage({
                message: `${name} accepted the request.`,
                is_system: true,
                room_id,
            })


            this.sendNotification({
                redirect_url: `/chats/${room_id}`,
                title: 'Rental Approved',
                message: `${name} accepted your rental request for ${unit_name}.`,
                room_id,
                user_id: user_id,
            })

        }
        if (request_status === 'reject') {
            unit_avail.request_status = ''
            this.socket.broadcast.to(room_id).emit('unit-avail')
            this.socket.emit('unit-avail')

            this.socket.broadcast.to(user_id).emit('notification-update')

            this.sendMessage({
                message: `${name} rejected the request.`,
                is_system: true,
                room_id,
            })

            this.sendNotification({
                redirect_url: `/chats/${room_id}`,
                title: 'Rental Request Rejected',
                message: `${name} rejected your rental request for ${unit_name}.`,
                room_id,
                user_id: user_id,
            })
        }

        unit_avail.save()
        // await Room.updateOne({ room_id, status: 0 })
    }

    sendNotification = async ({
        redirect_url = '',
        title = '',
        message = '',
        user_id,
    }) => {
        try {
            const res1 = await fetch(
                `${process.env.MAIN_BACKEND_URL}/api/user_notifications/${user_id}`
            )
            const landlord_notifs = await res1.json()

            if (
                landlord_notifs.length === 0 ||
                (landlord_notifs.length > 0 &&
                    landlord_notifs[0].message !== message)
            ) {
                const out = await fetch(
                    `${process.env.MAIN_BACKEND_URL}/api/notifications`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            title: title,
                            message: message,
                            redirect_url: redirect_url,
                            user_id: user_id,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                const data = await out.json()
            }

            // res.json({ test: data })
        } catch (err) {
            console.log(err)
        }
    }
}
