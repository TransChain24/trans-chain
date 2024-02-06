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
        // console.log(error);
        res.send(error);
    }
});

module.exports = auth;