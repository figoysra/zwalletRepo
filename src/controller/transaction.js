const transactionModels = require("../models/transactionmodel")
const usersModels = require("../models/usersmodel");
const { Sequelize } = require("sequelize")
const bcrypt = require("bcrypt");
const { success, failed, successLogin } = require("../helpers/response");
const Op = Sequelize.Op;

const transaction = {
    topUp : async(req, res) =>{
        try {
            const { body } = req;
            const id = req.userId;
            // console.log(id)
            const getID= await usersModels.findAll({
                where: {
                    id,
                },
            });
            
            //get saldo
            const saldo = getID[0].saldo

            // add transaction
            
            const transaction = await transactionModels.create({
                amount : body.amount,
                balance: saldo + body.amount,
                type: "Top Up",
                note: body.note,
                sender: id,
                receiver: id
            })
            // console.log(transaction)
            
            // update saldo
            const update = await usersModels.update(
                {
                    saldo : saldo + body.amount
                },  
                { where: { id } }
            );
            success(res, transaction, "Top Up Success");

        } catch (error) {
            // console.log(error)
            failed(res.status(401), 401, error)
        }
    },
    transfer: async(req, res) =>{
        try {
            const { body } = req;
            const id = req.userId;
            const idReceiver = req.params.id;
            const senderID = await usersModels.findAll({
                where: {
                    id,
                },
            });
            const receiverID = await usersModels.findAll({
                where: {
                    id: idReceiver,
                },
            });

            //get saldo
            const saldo = senderID[0].saldo;
            const saldoReceiver = receiverID[0].saldo
            console.log(saldoReceiver)

            if(saldo < body.amount){
                failed(res.status(404), 404, "saldo tidak mencukupi")
            }else{
                //add transaction
                const transaction = await transactionModels.create({
                    amount : body.amount,
                    balance: saldo - body.amount,
                    type: "Transfer",
                    note: body.note,
                    sender: id,
                    receiver: idReceiver,
                })
                //update saldo sender
                const update = await usersModels.update(
                    {
                        saldo: saldo - body.amount,
                    },
                    { where: { id } }
                );
                //update saldo receiver
                const updateReceiver = await usersModels.update(
                    {
                        saldo: saldoReceiver + body.amount,
                    },
                    { where: { id : idReceiver } }
                );
                //get transaction detail
                success(res, transaction, "Transfer Success");
            }
        } catch (error) {
            // console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    getIncome: async(req, res) =>{
        try {
            const id = req.userId;
            const result = await transactionModels.findAll({
                where: {
                    receiver: id
                }
            });
            success(res, result, "get Income Success")
        } catch (error) {
          // console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    getSpending: async(req, res)=>{
        try {
            const id = req.userId;
            const result = await transactionModels.findAll({
                where: {
                    sender: id,
                    type: "Transfer"
                }
            });
            success(res, result, "get Spending Success ");
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    getAllTransaction: async(req, res) =>{
        try {
            const id = req.userId;
            const result = await transactionModels.findAll({
                where: {
                    [Op.or] : [{sender: id}, {receiver: id}]
                },
                order: [['date', 'DESC']],
                include: [
                    {model: usersModels, as: 'senderUsers'},
                    {model: usersModels, as: 'receiverUsers'}
                ]
            });
            success(res, result, "get all transaction success");
        } catch (error) {
            console.log(error)
            failed(res.status(401), 401, error);
        }
    }
}
module.exports = transaction;
