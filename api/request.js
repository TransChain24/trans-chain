const { Router } = require('express');
const request = Router();
const requestModel = require("./../models/request");
const UserModel = require('./../models/user');

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

const express = require('express');

// API endpoint to retrieve pending requests for the current user

request.get('/pending-requests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the "requests" table for entries matching the criteria
    const pendingRequests = await requestModel.find({
      receiverID: userId,
      status: 'pending'
    }).populate('receiverID', 'username organizationName GSTIN');

    // Return the matching requests along with user data as a response
    res.status(200).json({ success: true, data: pendingRequests });
  } catch (error) {
    console.error('Error retrieving pending requests:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


request.get('/accepted-requests/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Query the "requests" table for entries matching the criteria
      const approvedRequests = await requestModel.find({
        receiverID: userId,
        status: 'accept'
      }).populate('receiverID', 'username organizationName GSTIN');
  
      // Return the matching requests as a response
      res.status(200).json({ success: true, data: approvedRequests });
    } catch (error) {
      console.error('Error retrieving pending requests:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

module.exports = request;
