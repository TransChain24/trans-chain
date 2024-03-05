const { Router } = require('express');
const common = Router();
const auth = require("./auth");
const otp = require("./otp");
const product = require("./product");
const display = require('./display');
const request = require('./request');

common.use("/auth", auth);
common.use("/otp", otp);
common.use("/product", product);
common.use("/display", display);
common.use("/request",request);

module.exports = common;