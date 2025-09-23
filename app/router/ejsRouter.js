const express = require('express')
const EjsController = require('../controllers/EjsController')
const AdminAuthCheck = require('../middleware/AdminAuthCheck')
const router = express.Router();

router.get('/register', EjsController.register)
router.get('/login', EjsController.login)
// category
router.get('/category', AdminAuthCheck, EjsController.categoryForm)
router.get('/admin/categories',AdminAuthCheck,EjsController.category)
router.get('/edit/category/:id',AdminAuthCheck,EjsController.editCategory)
// product 
router.get('/product',AdminAuthCheck,EjsController.productForm)
router.get('/edit/product/:id',AdminAuthCheck,EjsController.editProduct)

module.exports = router