const { Router } = require('express');
const product = Router();
const productModel = require("./../models/product");
const inventory = require('../models/inventory');

product.post("/create", async (req, res) => {
    try {
        const data = new productModel(req.body);
        const save = await data.save();
        if (save) {
            res.send({ "status": true, data: data });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

product.put("/update/:name", async (req, res) => {
    try {
        const data = await productModel.findOneAndUpdate({ productName: req.params.name }, req.body, { new: true });
        if (data) {
            res.send({ "status": true, data });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        res.send(error);
    }
});

product.delete("/delete/:id", async (req, res) => {
    try {
        const data = await productModel.findOneAndDelete({ productID: req.params.id });
        if (data) {
            res.send({ "status": true });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        res.send(error);
    }
});

product.get("/getAllProduct", async (req, res) => {
    try {
        const data = await productModel.find();
        if (data) {
            res.send({ "status": true, data: data });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        res.send(error);
    }
});

product.get("/getOwnerProducts/:ownerID", async (req, res) => {
    try {
        const ownerID = req.params.ownerID;

        // Find all product IDs associated with the given owner ID in the inventory table
        const productIDs = await inventory.find({ ownerID }).distinct('productID');

        // If no product IDs are found, send a 404 response
        if (!productIDs || productIDs.length === 0) {
            return res.status(404).json({ message: "No products found for the given owner" });
        }

        // Fetch details of each product using the retrieved product IDs
        const products = await Promise.all(productIDs.map(async (productID) => {
            // Find total quantity of the product in the inventory table
            const totalQuantity = await inventory.findOne({ ownerID, productID }).select('totalQuantity');

            // Find product details
            const productDetails = await productModel.findOne({ productID });

            return {
                productID: productID,
                productName: productDetails.productName,
                productDescription: productDetails.productDescription,
                totalQuantity: totalQuantity ? totalQuantity.totalQuantity : 0
            };
        }));

        // Send the list of products with their details and total quantity
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = product;