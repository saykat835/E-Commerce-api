const Deposit = require('../models/Deposit');
const User = require('../models/User');

// @desc    Create a deposit request
// @route   POST /api/deposits
// @access  Private
const createDeposit = async (req, res) => {
    try {
        const { method, amount, transactionId, senderNumber } = req.body;

        if (!method || !amount || !transactionId || !senderNumber) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Spam protection: check for pending request
        const existingPending = await Deposit.findOne({ user: req.user._id, status: 'pending' });
        if (existingPending) {
            return res.status(400).json({ message: 'Deployment phase already in progress. Please wait for your current request to synchronize.' });
        }

        // Check for duplicate Transaction ID
        const duplicateTx = await Deposit.findOne({ transactionId });
        if (duplicateTx) {
            return res.status(400).json({ message: 'This transaction identifier has already been submitted.' });
        }

        const deposit = await Deposit.create({
            user: req.user._id,
            method,
            amount,
            transactionId,
            senderNumber
        });

        res.status(201).json(deposit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user deposits
// @route   GET /api/deposits/mydeposits
// @access  Private
const getMyDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(deposits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all deposits (Admin)
// @route   GET /api/deposits
// @access  Private/Admin
const getAllDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(deposits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update deposit status (Admin)
// @route   PUT /api/deposits/:id
// @access  Private/Admin
const updateDepositStatus = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ message: 'Deposit request not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ message: 'Deposit has already been processed' });
        }

        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        if (status === 'approved') {
            const user = await User.findById(deposit.user);
            if (!user) {
                return res.status(404).json({ message: 'User associated with this deposit not found' });
            }
            user.balance += deposit.amount;
            await user.save();
        }

        deposit.status = status;
        await deposit.save();

        res.status(200).json(deposit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDeposit,
    getMyDeposits,
    getAllDeposits,
    updateDepositStatus
};
