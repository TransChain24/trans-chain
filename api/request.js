const { Router } = require('express');
const request = Router();
const requestModel = require("./../models/request");

request.post("/request", async (req, res) => {
    try {
        const data = new requestModel(req.body);
        const save = await data.save();

        if (save) {
            res.send({ "status": true, data: data });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, error: "Internal Server Error" });
    }
});

module.exports = request;
