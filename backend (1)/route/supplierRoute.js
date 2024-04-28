
const express = require('express')
const { CreateSuplier, FindSupplier, updateSuplireDetails, deleteSupplire } = require('../controller/supplierControoler')
const supplierRoute = express.Router()

supplierRoute.post('/create_supplier', CreateSuplier)
supplierRoute.get('/find_supplire', FindSupplier)
supplierRoute.patch('/update_supplire/:id', updateSuplireDetails)
supplierRoute.delete('/delete_supplire/:id', deleteSupplire)

module.exports = supplierRoute

