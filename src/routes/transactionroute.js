const express = require("express");
const authen = require("../middleware/authentication");

const{
    topUp, transfer, getIncome, getSpending, getAllTransaction
}=require('../controller/transaction')

const transactionRouter = express.Router()

transactionRouter
.get('/income', authen, getIncome)
.get('/spending', authen, getSpending)
.get('/transaction', authen, getAllTransaction)
.post('/topup', authen, topUp)
.post('/transfer/:id', authen, transfer) // id is id receiver

module.exports = transactionRouter;