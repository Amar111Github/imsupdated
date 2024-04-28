
const mongoose = require('mongoose')

const userTimeSchema = mongoose.Schema({
    userDate : { type : [], require : true},
})

const userTimeSModule = mongoose.model('usertime', userTimeSchema)

module.exports =  userTimeSModule;