const express = require('express')
const {  invoiceDetails,
    
    deleteInvoiceDetails,sameInvoiceData,
    findProduct,
    allInvoices,
    updateInvoiceStatus,updateInvoicePaidStatus, findProductList, addPayment} = require('../controller/inVoiceDetailsController')
const invoiceDetailsRoute = express.Router()
invoiceDetailsRoute.get('/allInvoices', allInvoices)
invoiceDetailsRoute.post('/invoices', invoiceDetails)
invoiceDetailsRoute.patch('/updateProductstatus/:id', updateInvoiceStatus)
invoiceDetailsRoute.patch('/updateProductPaidstatus/:id', updateInvoicePaidStatus)
invoiceDetailsRoute.post('/invoicesDetails', findProduct)
invoiceDetailsRoute.post('/addpayment', addPayment)
invoiceDetailsRoute.delete('/remove_invoice_details/:id', deleteInvoiceDetails)
invoiceDetailsRoute.post('/find_product_list', findProductList)
invoiceDetailsRoute.post('/allPurchase_no', sameInvoiceData)
module.exports = invoiceDetailsRoute

