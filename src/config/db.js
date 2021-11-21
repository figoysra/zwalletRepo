const {DB_USERNAME, DB_PASSWORD} = require("../helpers/env")
const {Sequelize} = require("sequelize")

const db = new Sequelize ('zwallet', DB_USERNAME, DB_PASSWORD, {
    host : 'localhost',
    dialect : "mysql",
})

db.authenticate()
    .then(()=>{
        console.log("koneksi aman")
    })
    .catch((err)=>{
        console.log(err)
    })

module.exports = db
