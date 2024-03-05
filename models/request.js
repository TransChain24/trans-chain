const { model, Schema } = require("mongoose");

const request = new Schema({
    transactionID: {
        type: String,
        ref: 'transaction',
        required: true
    },

    senderID: {
        type: String,
        required: true
    },

    receiverID: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

module.exports = model('request', request);