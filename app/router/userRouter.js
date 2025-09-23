const express = require('express')
const UserController = require('../controllers/UserController')
const UserAuth=require('../middleware/UserAuthCheck')
const router = express.Router();

router.post('/signup', UserController.createUser);
router.post('/signin', UserController.loginCreate)
router.get('/user/logout',UserController.userLogout)
router.get('/user/dashboard',UserAuth,UserController.checkAuth,UserController.userDahboard)
module.exports = router;