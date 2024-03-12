const { Router } = require("express");
const extractSerialNumbers = Router();

const SerialNumber = require("../models/serialNumber");
const Inventory = require("../models/inventory");
const Transaction = require("../models/transaction");
const Batch = require("../models/batch"); // Adjust the import statement

extractSerialNumbers.post("/extractSerialNumbers", async (req, res) => {
  try {
    const { distributorID, retailerID, productID, requestedQuantity } = req.body;

    const ownerID = retailerID;
    // Find matching batches
    const matchingBatches = await SerialNumber.find({
      ownerID: distributorID,
      productID,
      "batches.quantity": { $gt: 0 },
    }).sort({ createdAt: 1 });

    let remainingQuantity = requestedQuantity;
    const deductedSerialNumbers = [];

    console.log("Matching Batches:", matchingBatches);

    for (const batch of matchingBatches) {
      console.log("Processing Batch:", batch);

      for (const batchObj of batch.batches) {
        const { batchID, quantity, serialNumbers } = batchObj;

        const serialsToDeduct = Math.min(remainingQuantity, quantity);
        const currentDeductedSerialNumbers = serialNumbers.splice(
          0,
          serialsToDeduct
        );
        console.log("currentDeductedSerialNumbers: ", currentDeductedSerialNumbers);

        deductedSerialNumbers.push(...currentDeductedSerialNumbers);

        console.log("deductedSerialNumbers:", deductedSerialNumbers);

        // Update SerialNumber table
        await SerialNumber.updateOne(
          { ownerID: distributorID, productID, "batches.batchID": batchID },
          {
            $set: { "batches.$.serialNumbers": serialNumbers },
            $inc: { "batches.$.quantity": -serialsToDeduct },
          }
        );

        remainingQuantity -= serialsToDeduct;

        console.log("Remaining Quantity:", remainingQuantity);

        // Remove batch if entirely depleted
        if (quantity === serialsToDeduct) {
          console.log(
            "Before $pull:",
            await SerialNumber.findOne({ distributorID, productID })
          );
          await SerialNumber.updateOne(
            { ownerID: distributorID, productID },
            { $pull: { batches: { batchID } } }
          );
          console.log(
            "After $pull:",
            await SerialNumber.findOne({ distributorID, productID })
          );
        }

        if (remainingQuantity <= 0) {
          break; // Requested quantity fulfilled
        }
      }

      if (remainingQuantity <= 0) {
        break; // Requested quantity fulfilled
      }
    }

    console.log("Deducted Serial Numbers:", deductedSerialNumbers);

    // Create a new entry in the Batch table
    const newBatch = new Batch({
      batchID: `Batch_${productID}_D2R_${new Date().getTime()}`,
      productID,
      quantity: requestedQuantity,
      ownerID: retailerID,
      // Add other necessary fields as needed
    });

    // Save the new batch
    await newBatch.save();

    // Add entry in Transaction Table using the newly created batchID
    await Transaction.create({
      batchID: newBatch.batchID,
      productID,
      quantity: requestedQuantity,
      prevOwner: distributorID,
      currentOwner: retailerID,
      currentOwnerType: "retailer",
      status: "accept",
    });

    // Update Inventory table for the retailer
    await Inventory.updateOne(
      { ownerID: retailerID, productID },
      { $inc: { totalQuantity: requestedQuantity } },
      { upsert: true } // Create a new entry if it doesn't exist
    );

    // Update Inventory table for the distributor
    await Inventory.updateOne(
      { ownerID: distributorID, productID },
      { $inc: { totalQuantity: -requestedQuantity } },
      { upsert: true } // Create a new entry if it doesn't exist
    );

    // Add entry in SerialNumber table for the retailer
    const existingSerialNumber = await SerialNumber.findOne({
      ownerID: retailerID,
      productID,
    });

    if (existingSerialNumber) {
      // If an entry exists, add data to the existing batches array
      await SerialNumber.updateOne(
        { ownerID: retailerID, productID },
        {
          $push: {
            batches: {
              batchID: newBatch.batchID,
              quantity: requestedQuantity,
              serialNumbers: deductedSerialNumbers,
              // Add other necessary fields as needed
            },
          },
        }
      );
    } else {
      // If no entry exists, create a new entry with the batches array
      await SerialNumber.create({
        ownerID: retailerID,
        productID,
        batches: [
          {
            batchID: newBatch.batchID,
            quantity: requestedQuantity,
            serialNumbers: deductedSerialNumbers,
            // Add other necessary fields as needed
          },
        ],
      });
    }

    res.status(200).json({ deductedSerialNumbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = extractSerialNumbers;

// Is there any problem when we removed data from the serialNumber table.
// means that we are removing the data from the serialNumber whenever out serialNumbers is transfered.
// it leads to the problem that which serialnumber is previously gone to which user