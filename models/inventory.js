const { model, Schema } = require("mongoose");

const inventory = new Schema({
    ownerID: {
        type: String,
        required: true,
      },
      productID: {
        type: String,
        required: true,
      },
      totalQuantity: {
        type: Number,
        default: 0,
      },
});
    
module.exports = model('inventory', inventory);