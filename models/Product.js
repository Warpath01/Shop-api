const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);