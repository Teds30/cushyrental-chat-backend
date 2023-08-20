const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Message = new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        sender_id: {
            type: Number,
            required: true,
        },
        room_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Room',
        },
        status: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', Message)
