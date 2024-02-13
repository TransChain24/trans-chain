const { model, Schema } = require("mongoose");

const product = new Schema({
    productID: {
        type: String,
        required: true,
        unique:true
    },

    productName: {
        type: String,
        required: true
    },

    productDescription: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

module.exports = model('product', product);