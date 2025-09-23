const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('category', categorySchema)