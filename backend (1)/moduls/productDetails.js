
const mongoose = require('mongoose')

const productDetilsSchema = mongoose.Schema({
   arr : { type: [], require: true },
})

const productDetilsModule = mongoose.model('productDetails', productDetilsSchema)

module.exports = productDetilsModule