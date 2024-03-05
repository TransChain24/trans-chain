const { model, Schema } = require("mongoose");

const serialNumber = new Schema({
    batchID: {
        type: String,
        ref: 'batch',
        required: true
    },

    serialNumbers: {
        type: [String],
    }

}, {
    timestamps: true
});

module.exports = model('serialNumber', serialNumber);