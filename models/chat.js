const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatSchema = new Schema({
    members: [{
        type: Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    }],
    messages: [{
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        time: {
            type: String,
        }
    }]
})

module.exports = mongoose.model('Chat', chatSchema)