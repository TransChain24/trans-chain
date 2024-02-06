const { model, Schema } = require("mongoose");
const payment = new Schema({
    paymentID: {
        type: String,
        required: true
    },

    senderID: {
        type: String,
        required: true,
        ref: 'user'
    },

    receiverID: {
        type: String,
        required: true,
        ref: 'user'
    },

    productID:{
        type: String,
        required: true,
        ref: 'product'
    },

    status:{
        type: String,
        required: true,
    },

}, {
    timestamps: true
});

module.exports = model('payment', payment);