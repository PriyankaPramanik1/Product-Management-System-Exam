const User = require('../model/userModel');
const hashedPassword = require('../helper/HahedPassword')
const comparePassword = require('../helper/ComparePassword')
const jwt = require('jsonwebtoken');
class UserController {

    // checkAuth

    async checkAuth(req,res,next){
        if(req.user){
            next();
        }else{
            return res.redirect('/login')
        }
    }

    
    // create User
    async createUser(req, res) {
        try {
            const { name, email, phone, password } = req.body;
            if (!name || !email || !phone || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/register');
            }
            // check exist user
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash('error', 'User already exist');
                return res.redirect('/register');
            }

            // hashpassword
            const hashedPass = await hashedPassword(password)
            // create new user
            const newUser = new User({
                name,
                email, phone, password: hashedPass
            })

            const data = await newUser.save();
            if (data) {
                req.flash('success', 'registration successful, Please Log in');
                res.redirect('/login');
            } else {
                req.flash('error', 'User registratin failed');
                res.redirect('/register');
            }
        } catch (error) {
            req.flash('error', 'User registration failed');
            res.redirect('/register');
        }
    }

    // login User
    async loginCreate(req, res) {
        try {
            const { password, email } = req.body;
            if (!email || !password) {
                return res.redirect('/login');
            }
            const user = await User.findOne({ email });

            if (!user || !(await comparePassword(password, user.password))) {
                return res.redirect('/login');
            }

            // jwt secret
            let jwtSecret;
            let cookieName;
            if (user.role === 'admin') {
                jwtSecret = process.env.JWT_SECRET_ADMIN || "hellowelcomeAdmin123456";
                cookieName = 'adminToken';
            } else if (user.role == 'user') {
                jwtSecret = process.env.JWT_SECRET || "hellowelcometowebskittersacademy123456";
                cookieName = 'userToken';
            } else {
                console.log("user not found");
            }

            // check secret exist
            if (!jwtSecret) {
                console.log("JWT secret not found for user role", user.role);
                return res.status(500).redirect('/login'); // Internal server error
            }

            // create token

            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
                jwtSecret,
                { expiresIn: '60m' }
            );
            res.cookie(cookieName, token, { httpOnly: true, secure: true });
            res.redirect('/');
        } catch (error) {
            console.error('Login error:', err);
            res.redirect('/login');
        }
    }
    // User Logout
    async userLogout(req, res) {
        res.clearCookie('userToken');
        return res.redirect('/')
    }

    // user dashboard
    async userDahboard(req,res){
        res.render('userDashboard',{
            title:"User_Dashboard",
            user:req.user
        })
    }
}
module.exports = new UserController();