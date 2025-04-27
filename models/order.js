const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    userId: String,
    userEmail: String,
    userNumber: String,
    trackingNumber: {
        type: String,
        default: "",
    },
    sent: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);