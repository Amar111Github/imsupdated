
const express = require('express')
const { createCategory, findAllCategory, updateCategory, deletedCategory } = require('../controller/categoryController')
const categoryRoute = express.Router()


categoryRoute.post('/create_category', createCategory)
categoryRoute.get('/findall_category', findAllCategory)
categoryRoute.patch('/update_catdelete_categoryegory/:id', updateCategory)
categoryRoute.delete('/:id', deletedCategory)

module.exports = categoryRoute

