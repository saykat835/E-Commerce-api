const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create an order (Logged in user only)
router.post('/', protect, async (req, res) => {
    try {
        const { totalAmount, paymentMethod } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle balance deduction if applicable
        if (paymentMethod === 'balance') {
            if (user.balance < totalAmount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }
            user.balance -= totalAmount;
            await user.save();
        }

        const orderData = {
            ...req.body,
            user: req.user._id
        };
        const order = new Order(orderData);
        const newOrder = await order.save();

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user orders (Current user only)
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order status (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            const oldStatus = order.status;
            const newStatus = req.body.status;

            // Handle refund if order is cancelled and was paid via balance
            if (newStatus === 'cancelled' && oldStatus !== 'cancelled' && order.paymentMethod === 'balance') {
                const userToRefund = await User.findById(order.user);
                if (userToRefund) {
                    const refundAmount = Number(order.totalAmount) || 0;
                    userToRefund.balance = Number(userToRefund.balance) + refundAmount;
                    await userToRefund.save();
                }
            }

            order.status = newStatus || order.status;
            if (newStatus === 'cancelled' && req.body.cancellationReason) {
                order.cancellationReason = req.body.cancellationReason;
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
