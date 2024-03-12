const { model, Schema } = require("mongoose");

// const serialNumber = new Schema({
//     batchID: {
//         type: String,
//         ref: 'batch',
//         required: true
//     },

//     serialNumbers: {
//         type: [String],
//     }

// }, {
//     timestamps: true
// });

const serialNumber = new Schema({
    ownerID: {
      type: String,
      required: true,
    },
    productID: {
      type: String,
      required: true,
    },
    batches: [
      {
        batchID: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        serialNumbers: {
          type: [String],
          required: true,
        },
      },
    ],
  });

module.exports = model('serialNumber', serialNumber);