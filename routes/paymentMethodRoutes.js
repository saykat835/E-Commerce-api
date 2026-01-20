const express = require('express');
const router = express.Router();
const { getPaymentMethods, getAllPaymentMethods, savePaymentMethod, deletePaymentMethod } = require('../controllers/paymentMethodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPaymentMethods);
router.get('/admin', protect, admin, getAllPaymentMethods);
router.post('/', protect, admin, savePaymentMethod);
router.delete('/:id', protect, admin, deletePaymentMethod);

module.exports = router;
