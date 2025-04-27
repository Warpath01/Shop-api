const Product = require('../../models/Product');
const Order = require('../../models/order');
const User = require('../../models/User');
const axios = require('axios');


exports.showOrders = async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    const orders = await Order.find({ userId: req.user.userId }).populate('product');
    res.render('orders', { orders });
};


// for api access on different apps--------------
exports.showOrdersApi = async (req, res) => {
    const findOrders = await Order.find().populate('product');

    res.json({ order });
};

exports.createOrder = async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    const userInfo = req.user;

    await Order.create({
        product: req.params.id,
        userId: userInfo.userId,
        userEmail: userInfo.email,
        userNumber: userInfo.cellnumber,

    });

    const product = await Product.findById(req.params.id);

    // Prepare webhook payload -----------------------------------------
    const webhookUrl = process.env.WEBHOOK_URL; // replace with actual URL
    const payload = {
        product_name: product.name,
        product_price: product.price,
        product_description: product.description,
        user_email: userInfo.email,
        user_number: userInfo.cellnumber,
        tracking_number: "",
        sent: false
    };

    if (webhookUrl) {
        try {
            await axios.post(webhookUrl, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to send webhook:', error.message);
        }
    } else {
        console.log('No webhook URL provided.');
    }
    // ---------------------------------------------------------------



    req.flash('order', `You ordered a ${product.name}`);
    res.redirect('/products');
};

exports.deleteOrder = async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/orders');
};
