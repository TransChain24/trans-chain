const { model, Schema } = require("mongoose");

const user = new Schema({
    userName: {
        type: String,
        required: true
    },

    emailID: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    organizationName:{
        type: String,
        required: true
    },

    GSTIN:{
        type: String,
        required: true,
        maxlength: 15
    },

    role:{
        type: String,
        required: true,
        // enum: ['supplier', 'manufacturer', 'distributor', 'retailer']
    }

}, {
    timestamps: true
});

module.exports = model('user', user);