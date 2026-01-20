const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    supportEmail: {
        type: String,
        default: 'support@example.com'
    },
    supportPhone: {
        type: String,
        default: '+880123456789'
    },
    codCharge: {
        type: Number,
        default: 50
    },
    socialLinks: {
        facebook: { type: String, default: '#' },
        twitter: { type: String, default: '#' },
        instagram: { type: String, default: '#' },
        linkedin: { type: String, default: '#' },
        youtube: { type: String, default: '#' }
    },
    authImages: {
        type: [String],
        default: [
            'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
            'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
            'https://images.unsplash.com/photo-1642104708102-79760c223521?w=800&q=80'
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
