const { Router } = require('express');
const acceptRequest = Router();
const request = require('./../models/request');
const SerialNumber = require('./../models/serialNumber');
const transaction = require('./../models/transaction');
const product = require('./../models/product');
const batch = require('./../models/batch');
const Inventory = require('./../models/inventory'); // Import the Inventory model

acceptRequest.post('/acceptRequest', async (req, res) => {
  try {
    const { requestID, productID, quantity, manufacturerID, distributorID } = req.body;

    const ownerID = distributorID;
    // Update Request Status
    await request.updateOne({ _id: requestID }, { $set: { status: 'accept' } });

    // Fetch product count from the product table
    const productDetails = await product.findOne({ productID });
    if (!productDetails) {
      throw new Error('Product details not found');
    }
  
    // Generate Serial Numbers starting from the product count
    const startCount = productDetails.count + 1;
    const generatedSerialNumbers = Array.from({ length: quantity }, (_, index) => `${productID}_${startCount + index}`);
    console.log(generatedSerialNumbers);

    // Add Entry in Batch Table
    const batchID = `Batch_${productID}_M2D_${new Date().getTime()}`;
    await batch.create({ batchID, productID, quantity, serialNumbers: generatedSerialNumbers });

    // Create or update SerialNumber entry
    await SerialNumber.updateOne(
      { ownerID, productID },
      {
        $push: {
          batches: {
            batchID,
            quantity,
            serialNumbers: generatedSerialNumbers,
          },
        },
      },
      { upsert: true } // Creates a new entry if it doesn't exist
    );

    // Add Entry in Transaction Table
    await transaction.create({
      batchID,
      productID,
      quantity,
      prevOwner: manufacturerID,
      currentOwner: distributorID,
      currentOwnerType: 'distributor',
      status: 'accept',
    });

    // Update Product Count
    await product.updateOne({ productID }, { $inc: { count: quantity } });

    // Update or create Inventory entry
    await Inventory.updateOne(
      { ownerID, productID },
      { $inc: { totalQuantity: quantity } },
      { upsert: true } // Creates a new entry if it doesn't exist
    );

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = acceptRequest;
