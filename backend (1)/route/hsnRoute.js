
const express = require('express')
const {  createHsn,findAllHsn,updateHsn,deletedhsn } = require('../controller/hsnController')
const hsnRoute = express.Router()


hsnRoute.post('/create_hsn', createHsn)
hsnRoute.get('/findall_hsn', findAllHsn)
hsnRoute.patch('/update_hsn/:id', updateHsn)
hsnRoute.delete('/:id', deletedhsn)

module.exports = hsnRoute