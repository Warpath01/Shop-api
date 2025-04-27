require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes/productRoute');
const orderRoutes = require('./routes/productRoutes/orderRoute')
const authRoutes = require('./routes/auth/authRoutes');
const localVar = require('./middleware/localVar');
const User = require('./models/User');
const path = require('path');
const app = express();


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());





// flash
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
    secret: 'yourSecretKey', // replace this with a secure key
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.order = req.flash('order');
    // res.locals.user = req.flash('user');


    try {
        const decoded = jwt.verify(req.cookies.shopApiApp, '1235rfsdfsdr45yty434sfsdfg')
        req.user = decoded

    } catch (error) {
        req.user = null
    }

    // console.log(req.user)
    next();
});





app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

// app.get('/', () => {
//     if (req.session.user) {
//         res.render('index', { user: req.session.user });
//     } else {
//         res.render('index', { user: null });
//     }
// })

// app.use(function (req, res, next) {
//     res.locals.errors = [];
//     res.locals.success = [];
//     next()
// })
// pages routes
app.get('/', (req, res) => {
    if (req.user) {
        return res.render('index', { user: req.user })
    }
    res.redirect('/login')

})
app.get('/login', (req, res) => {
    if (!req.user) {
        return res.render('login')
    }
    res.redirect('/')
})
app.get('/signup', (req, res) => {
    if (!req.user) {
        return res.render('register')
    }
    res.redirect('/')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port "http://localhost:${PORT}"`));