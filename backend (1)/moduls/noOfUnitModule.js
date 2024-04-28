const mongoose = require('mongoose')

const noOfUnitSchema = mongoose.Schema({
    sumByProductName  : { type : String, require : true },
})

const noOfUnitModule = mongoose.model('noOfUnit', noOfUnitSchema);

module.exports = noOfUnitModule;