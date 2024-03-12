const { Router } = require('express');
const user = require('../models/user');
const display = Router();

display.get("/display/", async (req, res) => {
    try {
        const role = req.query.role;
        console.log("Role:", role);
        if (role == "distributor") {
            const data = await user.find({ role: "manufacturer" });
            if (data) {
                res.send({ status: true, data: data });
            } else {
                res.send({ status: false });
            }
        } else if (role == "retailer") {
            const data = await user.find({ role: "distributor" });
            if (data) {
                res.send({ status: true, data: data });
            } else {
                res.send({ status: false });
            }
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = display;