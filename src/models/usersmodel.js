const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db");

const Users = db.define(
    "users",
    {
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        pin: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,

        },
        password: {
            type: DataTypes.STRING,

        },
        saldo: {
            type: DataTypes.NUMBER,

        },
        image: {
            type: DataTypes.STRING,

        },
        phone: {
            type: DataTypes.STRING,
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
)

module.exports = Users;