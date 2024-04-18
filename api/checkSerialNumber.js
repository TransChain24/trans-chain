const { Router } = require('express');
const checkSerialNumber = Router();
const RequestModel = require('./../models/request');
const SerialNumberModel = require('./../models/serialNumber');
const TransactionModel = require('./../models/transaction');
const ProductModel = require('./../models/product');
const BatchModel = require('./../models/batch');
const InventoryModel = require('./../models/inventory'); // Import the Inventory model
const UserModel = require("./../models/user");

// API endpoint to handle the serial number input from the consumer
checkSerialNumber.post('/checkSerialNumber', async (req, res) => {
    try {
        const { serialNumber } = req.body;
        
        console.log(serialNumber);
        // Extract product ID from the serial number
        const productID = serialNumber.split('_')[0];
        console.log(productID);

        // Step 2: Find the batch in the batches table
        const batchIDPattern = new RegExp(`^Batch_${productID}_D2R_.*`);

        // console.log(batchIDPattern);

        const Batch = await BatchModel.findOne({ 
            productID,
            batchID: batchIDPattern,
            serialNumbers: { $in: serialNumber } 
        });
        
        if (!Batch) {
            // If no batch is found, return status false
            // return res.status(404).json({ status: false, message: 'Batch not found' });
            return res.status(404).json({ status: false, message: 'Invalid Serial Number' });
        }
        console.log(Batch);

        // Step 3: Find the transaction in the transactions table
        const Transaction = await TransactionModel.findOne({ batchID: Batch.batchID });

        if (!Transaction) {
            // If no transaction is found, return status false
            return res.status(404).json({ status: false, message: 'Transaction not found' });
        }
        console.log(Transaction);

        // Step 4: Find all batches with the same distributor as the previous owner
        const distributorBatches = await TransactionModel.find({
            currentOwnerType: 'distributor',
            productID,
            currentOwner: Transaction.prevOwner
        }).distinct('batchID');

        console.log(distributorBatches);

        // Step 5: Find the batch containing the given serial number
        const distributorBatch = await BatchModel.findOne({
            batchID: { $in: distributorBatches },
            serialNumbers: serialNumber
        });

        if (!distributorBatch) {
            // If no distributor batch is found, return status false
            return res.status(404).json({ status: false, message: 'Distributor batch not found' });
        }
        console.log(distributorBatch);

        // Step 6: Find the transaction for the distributor batch
        const distributorTransaction = await TransactionModel.findOne({ batchID: distributorBatch.batchID });

        if (!distributorTransaction) {
            // If no distributor transaction is found, return status false
            return res.status(404).json({ status: false, message: 'Distributor transaction not found' });
        }

        // Fetch organization name and GSTIN for each role
        const manufacturerInfo = await UserModel.findById(distributorTransaction.prevOwner);
        const distributorInfo = await UserModel.findById(distributorTransaction.currentOwner);
        const retailerInfo = await UserModel.findById(Transaction.currentOwner);

        // Construct the response array
        const result = [
            { role: 'Manufacturer', ID: distributorTransaction.prevOwner, OrganizationName: manufacturerInfo.organizationName, GSTIN: manufacturerInfo.GSTIN},
            { role: 'Distributor', ID: distributorTransaction.currentOwner, OrganizationName: distributorInfo.organizationName, GSTIN: distributorInfo.GSTIN},
            { role: 'Retailer', ID: Transaction.currentOwner, OrganizationName: retailerInfo.organizationName, GSTIN: retailerInfo.GSTIN }
        ];

        // Return the response array
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.error('Error processing serial number:', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

module.exports = checkSerialNumber;