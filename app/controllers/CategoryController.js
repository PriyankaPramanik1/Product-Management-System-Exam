const Category = require('../model/categoryModel');
const statusCode = require('../helper/satusCode')
const Product = require('../model/productModel')
const fs = require('fs')
class CatergoryController {

    // create category
    async createCategory(req, res) {
        try {
            const { category_name } = req.body;
            const data = new Category({
                category_name
            })
            const category = await data.save();
            if (category) {
                return res.redirect('/product')
            }
            return res.status(statusCode.CREATED).json({
                success: true,
                message: "Category created successfully",
                category: category
            });

        } catch (error) {
            return res.status(statusCode.BAD_REQUEST).json({
                message: "Category is not created ",
            });
        }
    }
    // update category
    async updateCategory(req, res) {
        const id = req.params.id;
        const { category_name } = req.body;
        const Data = await Category.findByIdAndUpdate(id, { category_name });
        if (Data) {
            return res.redirect('/admin/categories')
        }
        return res.status(statusCode.CREATED).json({
            message: "Category updated successfully",
            category: Data
        })
    }

    // delete category
    async deleteCategory(req, res) {
        try {
            const id = req.params.id;

            // Find all products associated with the category
            const productsToDelete = await Product.find({ category_id: id });

            // Delete images for all found products using a for...of loop for robustness
            for (const product of productsToDelete) {
                if (product.image) {
                    // Construct the correct absolute path
                 const imagePath = req.file ? req.file.path : null;

                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log(`Deleted image: ${imagePath}`);
                    }
                }
            }

            // Delete all products with that category_id
            await Product.deleteMany({ category_id: id });
            console.log(`Deleted all products for category: ${id}`);

            // Delete the category itself
            const category = await Category.findByIdAndDelete(id);

            if (category) {
                console.log(`Deleted category: ${category.category_name}`);
                return res.redirect('/admin/categories');
            }

            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });

        } catch (error) {
            console.error('Error deleting category:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
module.exports = new CatergoryController()