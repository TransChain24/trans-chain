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

// auth.get('/allUsers', async (req, res) => {
//     try {
//       const users = await user.find().select('userName emailID role');
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
// });

auth.get('/login/:email', async(req,res) => {
    try {
        const foundUser = await user.findOne({ emailID : req.params.email}).select('userName emailID role');
        if(!foundUser)
            return res.status(404).json({message: "User Not Found"});
        console.log("found");
        res.json(foundUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

auth.get("/loginn", async (req, res) => {
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