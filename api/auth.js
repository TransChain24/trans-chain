const { Router } = require('express')
const auth = Router();
const user = require("./../models/user");

auth.post("/register", async (req, res) => {
    try {
        const data = new user(req.body);
        console.log(data);
        const save = await data.save();
        if (save) {
            res.send({ "status": true, data: data });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        res.send(error);
    }
});

auth.post("/login", async (req, res) => {
    try {
        const { emailID, password } = req.body;
        const data = await user.findOne({ emailID: emailID, password: password });
        console.log(data);
        if (data) {
            res.send({ "status": true, id: data._id, role: data.role });
        } else {
            res.send({ "status": false });
        }
    } catch (error) {
        res.send(error);
    }
});

auth.get("/profile", async (req, res) => {
    try {
        const { id } = req.query;
        const data = await user.findById({ _id: id });
        res.send({ status: true, data: data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, error: "Internal Server Error" });
    }
});

module.exports = auth;