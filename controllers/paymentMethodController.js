const PaymentMethod = require('../models/PaymentMethod');

// @desc    Get all active payment methods
// @route   GET /api/payment-methods
// @access  Public
const getPaymentMethods = async (req, res) => {
    try {
        const methods = await PaymentMethod.find({ isActive: true });
        res.status(200).json(methods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payment methods (Admin)
// @route   GET /api/payment-methods/admin
// @access  Private/Admin
const getAllPaymentMethods = async (req, res) => {
    try {
        const methods = await PaymentMethod.find({});
        res.status(200).json(methods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update payment method (Admin)
// @route   POST /api/payment-methods
// @access  Private/Admin
const savePaymentMethod = async (req, res) => {
    try {
        const { id, name, number, instructions, isActive, image } = req.body;

        if (id) {
            const method = await PaymentMethod.findByIdAndUpdate(id, {
                name, number, instructions, isActive, image
            }, { new: true });
            return res.json(method);
        }

        const method = await PaymentMethod.create({
            name, number, instructions, isActive, image
        });
        res.status(201).json(method);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete payment method (Admin)
// @route   DELETE /api/payment-methods/:id
// @access  Private/Admin
const deletePaymentMethod = async (req, res) => {
    try {
        await PaymentMethod.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Payment method removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPaymentMethods,
    getAllPaymentMethods,
    savePaymentMethod,
    deletePaymentMethod
};
