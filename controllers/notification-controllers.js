const fetch = require('node-fetch')

const sendNotification = async (req, res, next) => {
    const { tenant_name, unit_name, room_id, landlord_id } = req.body
    try {
        const res1 = await fetch(
            `${process.env.MAIN_BACKEND_URL}/api/user_notifications/${landlord_id}`,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
        const landlord_notifs = await res1.json()

        if (
            !landlord_notifs[0].message ===
            `${tenant_name} is availing for ${unit_name}.`
        ) {
            const out = await fetch(
                `${process.env.MAIN_BACKEND_URL}/api/notifications`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: 'Tenant Request',
                        message: `${tenant_name} is availing for ${unit_name}.`,
                        redirect_url: `/chats/${room_id}`,
                        user_id: landlord_id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    Accept: 'application/json',
                    },
                }
            )
            const data = await out.json()

            res.json({ test: data })
        }
    } catch (err) {
        console.log(err)
    }
}

exports.sendNotification = sendNotification
