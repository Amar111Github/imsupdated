

const express = require('express')
const { addproduct, categoryAndSupplire, getProduct, updateProduct, deleteProduct } = require('../controller/productController')

const productRoute = express.Router()

productRoute.post('/add', addproduct)
productRoute.patch('/update_product/:id', updateProduct)
productRoute.delete('/delete_product/:id', deleteProduct)
productRoute.post('/all_product', getProduct)
productRoute.get('/category_Supplire', categoryAndSupplire)

module.exports = productRoute