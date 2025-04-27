const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    cellphone: String,
    address: String,
    username: String,
    password: String
},
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);