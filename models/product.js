const { model, Schema } = require("mongoose");

const product = new Schema({
    productID: {
        type: String,
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    productQuantity:{
        type: Number,
        required: true
    },

    productNumbers:{
        type: [String],
    }
}, {
    timestamps: true
});

module.exports = model('product', product);