const { Router } = require('express');
const product = Router();
const productModel = require("./../models/product");

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

module.exports = product;