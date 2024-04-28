
const express = require('express')
const { userActuveTime, finduserActiveTime, updateTime } = require('../controller/userTimeController')

const userActiveRoute = express.Router()

userActiveRoute.post('/user_active_time', userActuveTime)
userActiveRoute.get('/find_time', finduserActiveTime)
userActiveRoute.patch('/update_time', updateTime)

module.exports = userActiveRoute