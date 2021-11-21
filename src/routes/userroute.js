const express = require('express')
const authen = require('../middleware/authentication')
const upload = require('../middleware/upload')

const{
    getAll,getDetail,login,register,update, checkPin, updatePin
} = require('../controller/users')

const usersRouter = express.Router()

usersRouter
.get('/users', authen, getAll)
.get('/user', authen, getDetail)
.post('/login', login)
.post('/pin',authen, checkPin )
.post('/register', register)
.put('/updateUser', authen, upload, update)
.put('/pin/:id', updatePin)

module.exports = usersRouter;