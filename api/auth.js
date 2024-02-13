const { Router } = require('express')
const auth = Router();
const user = require("./../models/user");


auth.post("/register", async (req, res) => {
    try {
        const data = new user(req.body);
        console.log(data);
        const save = await data.save();
        if (save) {
            res.send(data);
        } else {
            console.log("Error");
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
            res.send({ "status": "login successfull..", id: data._id });
        } else {
            res.send({ "status": "login failed.." });
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = auth;