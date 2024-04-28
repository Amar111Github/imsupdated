
const express = require('express')
const { findCategory, addPayment,findProduct,samePurchaseData, productDetails, deleteProductDetails, allpurchaseProduct,updateProductstatus,findProductList} = require('../controller/productDetailsControler')
const productDetailsRoute = express.Router()
productDetailsRoute.get('/allpurchase', allpurchaseProduct)
productDetailsRoute.post('/product', productDetails)
productDetailsRoute.patch('/updateProductstatus/:id', updateProductstatus)
productDetailsRoute.post('/category', findCategory)
productDetailsRoute.post('/productsDetails', findProduct)
productDetailsRoute.post('/addpayment', addPayment)
productDetailsRoute.delete('/remove_product_details/:id', deleteProductDetails)
productDetailsRoute.post('/find_product_list', findProductList)
productDetailsRoute.post('/allPurchase_no', samePurchaseData)
module.exports = productDetailsRoute