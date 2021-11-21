const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const transactionRouter = require("./src/routes/transactionroute")
const usersRouter = require('./src/routes/userroute')

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.static(__dirname + "/uploads"));
app.use(usersRouter);
app.use(transactionRouter);


const PORT = 2021;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Service running on Port ${PORT}`);
});
module.exports = app;