const express = require('express')
const ProductController = require('../controllers/ProductController')
const AdminAuthCheck = require('../middleware/AdminAuthCheck');
const router = express.Router()

const upload = require('../helper/multerFile');

// product
router.post('/create/product',upload.single('image'), AdminAuthCheck,  ProductController.createProduct);
router.post('/update/product/:id',upload.single('image'),AdminAuthCheck, ProductController.updateProduct)
router.get('/product/delete/:id', AdminAuthCheck, ProductController.deleteProduct);


router.get('/admin/products',AdminAuthCheck, ProductController.getProduct);
router.get('/',ProductController.getHome)
router.get('/filter', ProductController.filter)

module.exports = router