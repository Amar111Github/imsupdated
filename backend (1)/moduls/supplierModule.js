
const mongoose = require('mongoose')

const supplierSchema = mongoose.Schema({
    suplierName: { type: String, require: true },
    suplierEmail: { type: String, require: true },
    suplierAddress: { type: String, require: true },
    suplierContact: { type: String, require: true },
    suplierGST:  { type: String, require: true },
})

const supplierModule = mongoose.model('suppliyer', supplierSchema);
module.exports = supplierModule;