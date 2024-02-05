const { model, Schema } = require("mongoose");

const register = new Schema({
    emailID: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('register', register);