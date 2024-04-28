const mongoose = require('mongoose')

const taxSchema = mongoose.Schema({
    taxName: { type: String, require: true },
    taxPer: { type: String, require: true },
})

const taxModule = mongoose.model('tax', taxSchema);
module.exports = taxModule;