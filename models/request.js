const { model, Schema } = require("mongoose");

const request = new Schema({
    // transactionID: {
    //     type: String,
    //     ref: 'transaction',
    //     required: true
    // },

    productID:{
        type: String,
        ref: 'product',
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

    quantity: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "accept", "reject"],
        default: "pending",
        required: true
    },

    sendTo: {
        type: String,
        enum: ["distributor", "retailer"],
        required: true
    },

}, {
    timestamps: true
});

module.exports = model('request', request);

// when request accept then perform
    // create batch
    // create transaction
    // update product counter by quantity in product
    // assign serial numbers