const usersModels = require("../models/usersmodel")
const { Sequelize } = require("sequelize")
const bcrypt = require("bcrypt");
const fs = require("fs");
const { success, failed, successLogin } = require("../helpers/response");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../helpers/env");
const Op = Sequelize.Op;

const users = {
    getAll : async (req, res) =>{
        try {
            const { query } = req;
            const idUser = req.userId; 
            const search = query.search === undefined ? "" : query.search;
            const field = query.field === undefined ? "id" : query.field;
            const typeSort = query.sort === undefined ? "" : query.sort;
            const limit = query.limit === undefined ? 10 : parseInt(query.limit);
            const page = query.page === undefined ? 1 : query.page;
            const offset = page === 1 ? 0 : (page - 1) * limit;
            const result = await usersModels.findAll({
                where: {
                    firstName: {
                        [Op.like]: `%${search}%`,
                    },
                        
                    },
                offset,
                limit,
                field,
                typeSort,
                })
                const data = result.filter((e)=> {
                    if(e.id !== idUser){
                        return(e)
                    }
                })
                // console.log(data)
            success(res, data, 'Get All Users Success');
        } catch (error) {
            failed(res.json(401), 401, error);
        }
    },
    getDetail : async(req, res) =>{
        try {
            const id = req.userId;
            const result = await usersModels.findAll({
                where: {
                id,
                },
            });
            success(res, result[0], "Get Details Users Success");
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    login: async (req, res) => {
        try {
            const { body } = req;
            const email = req.body.email;
            const cekEmail = await usersModels.findAll({
                where: {
                email,
                },
            });
            if (cekEmail.length <= 0) {
                failed(res.status(404), 404, "Email not Exist");
            } else {
                const passwordHash = cekEmail[0].password;
                bcrypt.compare(body.password, passwordHash, (error, checkpassword) => {
                    if (error) {
                        failed(res.status(404), 404, error);
                    } else if (checkpassword === true) {
                        const user = cekEmail[0];
                        const payload = {
                            id: user.id,
                        };
                        const token = jwt.sign(payload, JWT_SECRET)
                        
                        successLogin(res, user, token, "Login Success");  
                    } else {
                        failed(res.status(404), 404, "Wrong Password");
                    }
                });
            }
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    register: async(req, res) =>{
        try {
            const { body } = req;
            // const pinHash = bcrypt.hashSync(body.pin, 10)
            const email = req.body.email;
            const cekEmail = await usersModels.findAll({
                where: {
                    email,
                },
            });
            if(cekEmail.length <= 0){
                const passwordHash = bcrypt.hashSync(body.password, 10);
                const register = await usersModels.create({
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    password: passwordHash,
                    phone: body.phone,
                    pin: "0",
                    saldo : "0",
                    image: "default.png",
                });
                success(res, register, "Register Success");
            }else{
                failed(res.status(404), 404, "Email already Register");
            }
        } catch (error) {
            // console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    update: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
            } = req.body;
            const id = req.userId;
            const Detail = await usersModels.findAll({
                where: {
                    id,
                },
            });
            const result = await usersModels.update(
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    image: req.file ? req.file.filename : "default.png",
                },
                { where: {id},
            });
            if (Detail[0].image === "default.png") {
                success(res, result, "Update Data Success");
            } else {
                fs.unlink(`./image/uploads/${Detail[0].image}`, (err) => {
                if (err) {
                    failed(res.status(500), 500, err);
                } else {
                    success(res, result, "Update Data Success");
                }
                });
            }
        } 
        catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    checkPin: async(req, res)=>{
        try {
            const { body } = req;
            const id = req.userId;
            const getPin = await usersModels.findAll({
                where: {
                    id,
                },
            });
            const pinHash = getPin[0].pin;
            // console.log(pinHash)
            bcrypt.compare(body.pin, pinHash, (error, result) => {
                // console.log(error)
                if (error) {
                    failed(res.status(404), 404, error);
                } else if (result === true) {
                    success(res, result, "Check Pin Berhasil");  
                } else {
                    failed(res.status(404), 404, "Wrong Pin");
                }
            });

        } catch (error) {
            // console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    updatePin: async(req, res) =>{
        try {
            const { body } = req;
            const id = req.params.id
            const pinHash = bcrypt.hashSync(body.pin, 10)
            const result = await usersModels.update(
                {
                    pin : pinHash
                },
                { where: { id } }
            );
            success(res, result, "Update pin Success");
        } catch (error) {
            console.log(error)
            failed(res.status(401), 401, error);
        }
    }

} 
module.exports = users;