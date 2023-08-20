const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Room = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        unit_id: {
            type: Number,
            required: true,
        },
        request_status: {
            type: String,
            required: false,
            default: '',
        },
        participants: [{ user_id: Number }],
        status: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Room', Room)
