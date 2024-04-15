const { Router } = require('express');
const user = require('../models/user');
const inventory = require('../models/inventory');
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

// display.get("/getUserDetails", async (req, res) => {
//     try {
//         const inventoryData = await inventory.find();

//         const userDataFromOwnerID = await user.find({ _id: inventoryData[ownerID]})

//         // Check if user details are found
//         if (inventoryData) {
//             res.status(200).json({status: "Data fatched successfully."});
//             if(userDataFromOwnerID){
//                 res.status(200).json({status: "User Data fatched"});
//             }
//         } else {
//             res.status(404).json({ message: "User details not found" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

display.get("/getUserDetailsFromInventory", async (req, res) => {
    try {
        // Retrieve all inventory data
        const inventoryData = await inventory.find();

        // Array to store user details
        const userDetails = [];

        // Loop through each inventory entry to fetch user details
        for (const entry of inventoryData) {
            // Retrieve user details based on ownerID
            const userDataFromOwnerID = await user.findById(entry.ownerID).select("_id userName organizationName GSTIN role");

            // If user details are found, push them to the array
            if (userDataFromOwnerID) {
                userDetails.push(userDataFromOwnerID);
            }
        }

        // Check if any user details were found
        if (userDetails.length > 0) {
            res.status(200).json({ status: "User details fetched successfully", userDetails });
        } else {
            res.status(404).json({ message: "User details not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = display;