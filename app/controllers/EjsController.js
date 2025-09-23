const express = require('express')
const categoryModel = require("../model/categoryModel")
const Product = require('../model/productModel')
class EjsController {

    // user Rgistration
    async register(req, res) {
        return res.render('register', {
            title: "User Rgistration",
            error: req.flash('error'),
            success: req.flash('success')
        })
    }

    // user login
    async login(req, res) {
        return res.render('login', {
            title: 'User Login',
            error: req.flash('error'),
            success: req.flash('success')
        })
    }

    // category Form
    async categoryForm(req, res) {
        res.render('categoryForm', {
            title: "category form"
        })
    }

    // product Form
    async productForm(req, res) {
    try {
        const category = await categoryModel.find();

        res.render('productForm', {
            title: "product form",
            category: category,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to load product form');
        res.redirect('/admin/products'); 
    }
}


    // category display
    async category(req, res) {
        const category = await categoryModel.find();
        let uniqueCategories = [...new Map(category.map(item => [item.category_name, item])).values()];
        const totalcategory = categoryModel.length;
        res.render('categoryManage', {
            title: "category",
            category: uniqueCategories,
            total: totalcategory
        })
    }
    // edit product
    async editProduct(req, res) {
        console.log(req.body);
        try {
            const id = req.params.id;
            const editData = await categoryModel.find();
            let uniqueCategories = [...new Map(editData.map(item => [item.category_name, item])).values()];
            const product = await Product.findById(id);
            res.render('editProduct', {
                title: "edit-page",
                category: uniqueCategories,
                product: product
            })
        } catch (error) {
            console.log(error);

        }
    }
    // edit category
    async editCategory(req, res) {
        console.log(req.body);
        try {
            const id = req.params.id;
            const editData = await categoryModel.findById(id);
            res.render('editCategory', {
                title: "edit-page",
                category: editData
            })
        } catch (error) {
            console.log(error);

        }
    }
}
module.exports = new EjsController()