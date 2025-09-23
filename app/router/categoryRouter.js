const express = require('express')
const CategoryController = require('../controllers/CategoryController')
const AdminAuthCheck = require('../middleware/AdminAuthCheck');
const router = express.Router()

router.post('/create/category', AdminAuthCheck, CategoryController.createCategory)
router.post('/update/category/:id',AdminAuthCheck,CategoryController.updateCategory)
router.get('/delete/category/:id',AdminAuthCheck,CategoryController.deleteCategory)
module.exports = router