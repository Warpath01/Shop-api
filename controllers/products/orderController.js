const Product = require('../../models/Product');
const Order = require('../../models/order');
const User = require('../../models/User');

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

    const details = findOrders.map(order => ({
        name: order.product ? order.product.name : 'No Product',
        image: order.product ? order.product.image : 'No Image',
        price: order.product ? order.product.price : 'No Price',
        description: order.product ? order.product.description : 'No Description',
        userEmail: order.userEmail,
        userNumber: order.userNumber,
        trackingNumber: order.trackingNumber,
        sent: order.sent
    }));

    // Directly join the individual fields with commas
    const order = {
        name: details.map(order => order.name).join(', '),
        image: details.map(order => order.image).join(', '),
        price: details.map(order => order.price).join(', '),
        description: details.map(order => order.description).join(', '),
        userEmail: details.map(order => order.userEmail).join(', '),
        userNumber: details.map(order => order.userNumber).join(', '),
        trackingNumber: details.map(order => order.trackingNumber).join(', '),
        sent: details.map(order => order.sent).join(', ')
    };


    console.log(order);

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
