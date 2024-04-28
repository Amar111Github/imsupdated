
const express = require('express')
const customerRoute = express.Router()

const {
    createCustomer,
    allCustomer,
    deleteCustomer,
    updateCustomer
}
 = require('../controller/customerController')

const {fileUploadMiddleware} = require('../middleware/multer');


customerRoute.post('/add_customer',fileUploadMiddleware, createCustomer);
customerRoute.put("/updateCustomer/:id", fileUploadMiddleware, updateCustomer);
customerRoute.get('/allCustomer', allCustomer)
customerRoute.delete('/delete_Customer/:id', deleteCustomer)

module.exports = customerRoute
