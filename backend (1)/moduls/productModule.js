
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    suppliers_id: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliyer' },
    category_name : { type: String, require: true },
    product_Name : { type: String, require: true },
    suplire_Email : { type: String, require: true },
    unit_Name : { type: String, require: true },
    taxName: { type: String, require: true },
    taxPer: { type: String, require: true },
    hsn : { type : String, require : true }
})

const productModule = mongoose.model('product', productSchema)

module.exports = productModule