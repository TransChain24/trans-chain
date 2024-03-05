const { Router } = require('express');
const common = Router();
const auth = require("./auth");
const otp = require("./otp");
const product = require("./product");

common.use("/auth", auth);
common.use("/otp", otp);
common.use("/product", product);

module.exports = common;