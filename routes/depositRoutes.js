const express = require('express');
const router = express.Router();
const { createDeposit, getMyDeposits, getAllDeposits, updateDepositStatus } = require('../controllers/depositController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createDeposit);
router.get('/mydeposits', protect, getMyDeposits);
router.get('/', protect, admin, getAllDeposits);
router.put('/:id', protect, admin, updateDepositStatus);

module.exports = router;
