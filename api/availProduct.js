const { Router } = require('express');
const inventory = require('../models/inventory'); // Import the inventory model

const availProduct = Router();


availProduct.get("/availProduct/", async (req, res) => {
    try {
        const distributorID = req.query.distributorID;
        const productID = req.query.productID;

        const available = await inventory.find({
            ownerID: distributorID,
            productID: productID,
        });

        console.log(available);

        if (available.length > 0) {
            const quantity = available[0].totalQuantity; // Access the first element in the array
            res.send({ status: true, totalQuantity: quantity });
        } else {
            res.send({ status: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: false, error: "Internal Server Error" });
    }
});

module.exports = availProduct;
