const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/products/orderController');

router.get('/', orderController.showOrders);
router.get('/all', orderController.showOrdersApi);
router.post('/:id', orderController.createOrder);
router.post('/:id/delete', orderController.deleteOrder);

module.exports = router;