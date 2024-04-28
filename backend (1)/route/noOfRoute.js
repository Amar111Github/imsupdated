
const express = require('express')
const {  dataInfo,findProductList} = require('../controller/noOfUnitController')
const noOfUnitRoute = express.Router()


noOfUnitRoute.get('/noOfUnit', dataInfo);
noOfUnitRoute.post("/profit", findProductList)
// hsnRoute.get('/findall_hsn', findAllHsn)
// hsnRoute.patch('/update_hsn/:id', updateHsn)
// hsnRoute.delete('/:id', deletedhsn)

module.exports = noOfUnitRoute