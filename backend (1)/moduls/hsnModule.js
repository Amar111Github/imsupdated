const mongoose = require('mongoose')

const hsnSchema = mongoose.Schema({
    hsn : { type : String, require : true }
})

const hsnModule = mongoose.model('hsn', hsnSchema)

module.exports = hsnModule