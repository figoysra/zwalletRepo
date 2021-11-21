const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db")
const Users = require("./usersmodel")

const Transaction = db.define(
    "transaction",
    {
        amount: {
            type: DataTypes.INTEGER
        },
        balance: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.ENUM('Transfer', 'Top Up')
        },
        note:{
            type: DataTypes.TEXT
        },
        sender:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiver:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);
Transaction.belongsTo(Users, { as: "senderUsers", foreignKey: "sender" });
Transaction.belongsTo(Users, { as: "receiverUsers", foreignKey: "receiver" });

module.exports = Transaction