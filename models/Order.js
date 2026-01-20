const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    customer: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        zipCode: String,
        contactPlatform: {
            type: String,
            enum: ['WhatsApp', 'Telegram', 'Messenger'],
            default: 'WhatsApp'
        },
        contactId: String
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['balance', 'cod'],
        default: 'balance'
    },
    codCharge: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
