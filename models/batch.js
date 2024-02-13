const { model, Schema } = require("mongoose");

const batch = new Schema({
    batchID: {
        type: String,
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

}, {
    timestamps: true
});

module.exports = model('batch', batch);