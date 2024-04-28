const userAuth = require('../auth/userAuthtication')
const { loginUser, forgetUserPass, createUser, getUserData, deleteUser, emailVerify, verifyOtp, sendOtp } = require('../controller/userControler')
const express = require('express')


const route = express.Router()

route.post('/create_user', createUser)
route.post('/loginUser', loginUser)
route.post('/email_verify', emailVerify)
route.post('/verify_otp', verifyOtp)
route.post('/send_otp', sendOtp)
route.get('/getuser',userAuth, getUserData)
route.delete('/deleteUser/:id', deleteUser)
route.patch('/forgetPass/:id', forgetUserPass)
module.exports = route