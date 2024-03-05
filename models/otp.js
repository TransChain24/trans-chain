const { model, Schema } = require('mongoose')

const otp = new Schema({
    emailID: {
        type: String,
    },
    otp: {
        type: String
    }
});

module.exports = model("otp", otp);