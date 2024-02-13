const express = require('express');
const app = express();
const mongoose = require('mongoose');
const common = require("./api/common");
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/common", common);

mongoose.connect("mongodb+srv://transchain24:transchain24@transchain-cluster.vyuaug6.mongodb.net/TransChain").then(() => {
    app.listen(3000, () => {
        console.log("connection on PORT 3000");
        console.log("Mongo DB connect");
    });
});