const { Router } = require('express')
const common = Router();
const auth = require("./auth");

common.use("/auth",auth);

module.exports = common;