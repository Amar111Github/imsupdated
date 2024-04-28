
const mongoose = require('mongoose')

const inVoiceDetailsSchema = mongoose.Schema({
   arr : { type: [], require: true },
   
})

const inVoiceDetailsModule = mongoose.model('invoiceDetails', inVoiceDetailsSchema)

module.exports = inVoiceDetailsModule