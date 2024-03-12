const { Router } = require('express');
const common = Router();
const auth = require("./auth");
const otp = require("./otp");
const product = require("./product");
const display = require('./display');
const request = require('./request');
const acceptRequest = require('./acceptRequest');
const extractSerialNumbers = require('./extractSerialNumbers');
const availProduct = require('./availProduct');

common.use("/auth", auth);
common.use("/otp", otp);
common.use("/product", product);
common.use("/display", display);
common.use("/request",request);
common.use("/acceptRequest",acceptRequest);
common.use("/extractSerialNumbers",extractSerialNumbers);
common.use("/availProduct",availProduct);

module.exports = common;