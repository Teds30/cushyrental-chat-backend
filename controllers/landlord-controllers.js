const fetch = require('node-fetch')
const Room = require('../models/room-schema')

const getInquiries = async (req, res, next) => {
    const expandUser = async (user_id) => {
        let data
        try {
            const response = await fetch(
                `${process.env.MAIN_BACKEND_URL}/api/users/${user_id}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${req.params.token}`,
                    },
                }
            )

            data = await response.json()
        } catch (err) {
            console.log(err)
        }
        return data
    }

    let out = []
    let rooms
    try {
        // room = await Room.distinct('tenant_id')
        rooms = await Room.find({
            landlord_id: req.params.landlord_id,
            request_status: { $ne: 'accepted' },
        })

        let i
        for (i = 0; i < rooms.length; i++) {
            let user_data = await expandUser(rooms[i].tenant_id)

            const expanded = { room: rooms[i], user: user_data }
            out.push(expanded)
        }
    } catch (err) {
        console.log(err)
    }
    res.json(out)
}

exports.getInquiries = getInquiries
