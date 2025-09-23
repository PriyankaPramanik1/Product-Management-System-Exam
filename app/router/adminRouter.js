
const express = require('express');
const AuthEjsController = require('../controllers/AdminController');
const adminAuthCheck = require('../middleware/AdminAuthCheck');

const router = express.Router();

router.get('/admin',adminAuthCheck,AuthEjsController.checkAuthAdmin,AuthEjsController.adminDashboard)
router.get('/admin/logout',AuthEjsController.adminlogout)


module.exports = router;