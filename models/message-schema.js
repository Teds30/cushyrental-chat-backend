const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Message = new Schema(
    {
        type: {
            type: String,
            default: 'text',
        },
        message: {
            type: String,
            required: true,
        },
        sender_id: {
            type: Number,
        },
        is_system: {
            type: Boolean,
            default: false,
        },
        room_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Room',
        },
        read: {
            type: Boolean,
            default: false,
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
