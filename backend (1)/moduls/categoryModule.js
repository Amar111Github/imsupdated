
const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category : { type : String, require : true }
})

const categoryModule = mongoose.model('category', categorySchema)

module.exports = categoryModule