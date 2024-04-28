
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_name : { type : String, require : true },
    product_price : { type : String, require : true },
    product_ctagery : { type : String, require : true },
    product_image : { type : String, require : true },
})

const productModule = mongoose.model('product', productSchema);

module.exports = productModule;