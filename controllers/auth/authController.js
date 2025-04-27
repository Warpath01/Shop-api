const User = require('../../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

    const errors = [];

    const { fullname, email, cellphone, address, username, password } = req.body;


    // validation -- 
    if (!fullname || !email || !cellphone || !address || !username || !password) {
        req.flash('error', "All fields are required.");
        return res.redirect('/signup');
    }

    if (password.length < 6) {
        req.flash('error', "Password must be at least 6 characters.");
        return res.redirect('/signup');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        req.flash('error', "Username already exists.");
        return res.redirect('/signup');
    }


    const newUser = new User({
        fullname,
        email,
        cellphone,
        address,
        username,
        password,
    });
    newUser.save();

    res.redirect('/login');
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        req.flash('error', 'Invalid credentials.');
        return res.redirect('/login');
    }

    const userPass = await User.findOne({ password });
    if (!userPass) {
        req.flash('error', 'Invalid credentials.');
        return res.redirect('/login');
    }

    if (!username || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/login');
    }


    // assign token to the account -
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, userId: user._id, username: user.username, fullname: user.fullname,
        email: user.email, cellnumber: user.cellphone
    }, "1235rfsdfsdr45yty434sfsdfg")

    res.cookie("shopApiApp", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
    })

    req.flash('success', 'Logged in Successfully.');
    return res.redirect('/');
};


exports.logout = async (req, res) => {
    res.clearCookie('shopApiApp');
    req.flash('success', 'Logged out Successfully.');
    return res.redirect('/login');

}