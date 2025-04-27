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
    const orders = await Order.find().populate('product');

    const orderDetails = orders.map(order => ({
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
    const joinedOrderDetails = {
        name: orderDetails.map(order => order.name).join(', '),
        image: orderDetails.map(order => order.image).join(', '),
        price: orderDetails.map(order => order.price).join(', '),
        description: orderDetails.map(order => order.description).join(', '),
        userEmail: orderDetails.map(order => order.userEmail).join(', '),
        userNumber: orderDetails.map(order => order.userNumber).join(', '),
        trackingNumber: orderDetails.map(order => order.trackingNumber).join(', '),
        sent: orderDetails.map(order => order.sent).join(', ')
    };


    console.log(joinedOrderDetails);

    res.json({ joinedOrderDetails });
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
