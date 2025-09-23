const express = require('express');
const statusCode = require('../helper/satusCode');
const ProductModel = require('../model/productModel');
const fs = require('fs')

class ProductController {

    async checkAuth(req, res, next) {
        if (req.user) {
            next()
        } else {
            return res.redirect('/')
        }
    }

    // post products
    async createProduct(req, res) {
    try {
        const { name, description, category_id } = req.body;
        const image = req.file ? req.file.path : null;

        if (!image) {
            req.flash('error', 'Image is required'); //error flash
            return res.redirect('/admin/products'); 
        }

        const newProductCreate = new ProductModel({
            name,
            image,
            description,
            category_id
        });

        const allProduct = await newProductCreate.save();
        if (allProduct) {
            req.flash('success', 'Product created successfully '); //  success flash
            return res.redirect('/admin/products');
        }

        req.flash('error', 'Something went wrong while creating product'); 
        return res.redirect('/admin/products');

    } catch (error) {
        console.error(error);
        req.flash('error', error.message || 'Internal server error'); 
        return res.redirect('/admin/products');
    }
}

    // update products
    async updateProduct(req, res) {
        console.log(req.body);
        try {
            const id = req.params.id;
            const { name, description, category_id } = req.body;
            console.log(req.file);

            const image = req.file ? req.file.path : null;

            const getImage = await ProductModel.findById(id);
            const oldImage = getImage.image;
            if (oldImage && fs.existsSync(oldImage)) {
                fs.unlinkSync(oldImage); // This deletes the old image every time
            }

            const Data = await ProductModel.findByIdAndUpdate(id, { name, description, category_id, image });
            if (Data) {
                return res.redirect('/admin/products');
            }

            if (!Data) {
                return res.status(statusCode.NOT_FOUND).json({ success: false, message: 'Data not found' });
            }

            return res.status(statusCode.OK).json({ success: true, message: 'Data updated', data: Data });
        } catch (error) {
            console.error(error);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An error occurred during the update.' });
        }
    }

    // delete products

    async deleteProduct(req, res) {
        console.log(req.body);

        try {
            const id = req.params.id;
            const Data = await ProductModel.findById(id);
            if (Data.image) {
                fs.unlinkSync(Data.image);
            }

            const product = await ProductModel.findByIdAndDelete(id)
            if (product) {
                return res.redirect('/admin/products')
            }
            if (!product) {
                return res.status(401).json({
                    success: false,
                    message: `data not find`,
                });
            }
            return res.status(200).json({
                success: true,
                message: ` deleted data`,
                data: product,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }


    getProducts = async () => {
        try {
            const products = await ProductModel.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    }
                },
                {
                    $unwind: '$categoryDetails'
                },
                {
                    $project: {
                        category_name: '$categoryDetails.category_name',
                        name: 1,
                        description: 1,
                        image: 1
                    }
                }
            ]);
            return products;

        } catch (error) {
            throw error;
        }
    }

    getProduct = async (req, res) => {
        try {
            const products = await this.getProducts();
            const totalProducts = products.length;
           return res.render('productManage', {
                title: "product Manage",
                product: products,
                total: totalProducts
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // search & filter
    filter = async (req, res) => {
        console.log(req.query);
        const { category, search } = req.query;
        let filteredData = await this.getProducts();
        const categories = [...new Set(filteredData.map(item => item.category_name))];

        if (category) {
            filteredData = filteredData.filter(item => item.category_name === category);
        }

        if (search) {
            filteredData = filteredData.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (filteredData.length === 0) {
            res.render('homePage', {
                data: [],
                message: 'No products found'
            });
        } else {
            res.render('homepage', {
                data: filteredData,
                product: filteredData,
                queryCategory: category || '',
                categories
            });
        }
    }



    getHome = async (req, res) => {
        const products = await this.getProducts();
        const categories = [...new Set(products.map(item => item.category_name))];
        try {
            // const products = await this.getProducts();
            res.render('homePage', {
                title: "Home Page",
                data: products,
                queryCategory: '',
                categories

            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();