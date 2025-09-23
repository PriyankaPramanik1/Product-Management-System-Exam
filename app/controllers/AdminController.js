const CategoryModel = require("../model/categoryModel");
const ProductModel = require("../model/productModel");

class AdminController {

    async checkAuthAdmin(req, res, next) {
        try {
            if (req.admin) {
                next();
            } else {
                res.redirect('/login')
            }
        } catch (error) {
            console.log(error);
        }
    }
    // admin Dashboard
    async adminDashboard(req, res) {
        console.log(req.admin);
        const category = await CategoryModel.find();
        const product = await ProductModel.find();
        res.render('adminDashboard', {
            title: "Admin Dashboard",
            admin: req.admin,
            category:category,
            product:product
        });
    }




    // logout admin
    async adminlogout(req, res) {
        try {
            res.clearCookie('adminToken')
            res.redirect('/')

        } catch (error) {
            console.log(error);

        }
    }
}
module.exports = new AdminController()


