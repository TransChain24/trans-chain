const { model, Schema } = require("mongoose");

const transaction = new Schema({
    // transactionID: {
    //     type: String,
    //     required: true
    // },

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

    prevOwner: {
        type: String,
        required: true
    },

    currentOwner: {
        type: String,
        required: true
    },

    currentOwnerType: {
        type: String,
        enum: ["distributor", "retailer"],
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "accept", "reject"],
        default: "pending",
        required: true
    }

}, {
    timestamps: true
});

module.exports = model('transaction', transaction);