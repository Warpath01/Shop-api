require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => seed())
    .catch(err => console.error(err));

async function seed() {
    await Product.deleteMany();
    await Product.insertMany([
        { image: 'Smartphone.jpg', name: 'Smartphone', price: 699, description: 'Latest model with high-resolution display' },
        { image: 'Laptop.jpg', name: 'Laptop', price: 1299, description: 'Lightweight laptop with powerful performance' },
        { image: 'Smartwatch.jpg', name: 'Smartwatch', price: 199, description: 'Fitness tracking and notifications on your wrist' },
        { image: 'Wireless.jpg', name: 'Wireless Earbuds', price: 149, description: 'Noise-cancelling and long battery life' },
        { image: 'Tablet.jpg', name: 'Tablet', price: 499, description: 'Portable touchscreen device great for media and work' },
        { image: 'Bluetooth.jpg', name: 'Bluetooth Speaker', price: 99, description: 'Portable speaker with rich sound' },
        { image: 'Gaming.jpg', name: 'Gaming Console', price: 399, description: 'Next-gen console for immersive gaming' },
        { image: 'Drone.jpg', name: 'Drone', price: 899, description: 'Camera drone with 4K video and GPS tracking' },
        { image: 'Action.jpg', name: 'Action Camera', price: 299, description: 'Waterproof camera ideal for adventure shots' },
        { image: 'Reader.jpg', name: 'E-Reader', price: 129, description: 'E-ink display perfect for reading in any light' }
    ]);
    console.log('Database seeded with gadgets');
    mongoose.connection.close();
}
