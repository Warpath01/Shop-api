const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products/productController');

router.get('/', productController.products);
// router.get('/products/new', productController.newForm);
// router.post('/create', productController.create);
// router.get('/products/:id/edit', productController.editForm);
// router.post('/products/:id', productController.update);

module.exports = router;