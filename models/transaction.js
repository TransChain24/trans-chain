const { model, Schema } = require("mongoose");

const transaction = new Schema({
    transactionID: {
        type: String,
        required: true
    },

    batchID: {
        type: String,
        ref: 'batch',
        required: true
    },

    productID: {
        type: String,
        ref: 'product',
        required: true
    },

    quantity: {
        type: Number,
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

    sendTo: {
        type: String,
        enum: ["distributor", "retailer"],
        required: true
    }

}, {
    timestamps: true
});

module.exports = model('transaction', transaction);