const Product = require('../../models/Product');

exports.products = async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    const products = await Product.find();
    res.render('shop', { products });
};

// exports.newForm = (req, res) => {
//     res.render('new');
// };

// exports.create = async (req, res) => {
//     const { name, image, price, description, userEmail, userNumber } = req.body;

//     res.redirect('/');
// };

// exports.editForm = async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     res.render('edit', { product });
// };

// exports.update = async (req, res) => {
//     await Product.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect('/');
// };