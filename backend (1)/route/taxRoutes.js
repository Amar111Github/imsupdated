
const express = require('express')
const { CreateTax,
    FindTax,
    updateTaxDetails,
    deleteTax } = require('../controller/taxController')
const supplierRoute = express.Router()

supplierRoute.post('/create_tax', CreateTax)
supplierRoute.get('/find_tax', FindTax)
supplierRoute.patch('/update_tax/:id', updateTaxDetails)
supplierRoute.delete('/delete_tax/:id', deleteTax)

module.exports = supplierRoute