const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        settings.supportEmail = req.body.supportEmail || settings.supportEmail;
        settings.supportPhone = req.body.supportPhone || settings.supportPhone;
        settings.codCharge = req.body.codCharge !== undefined ? req.body.codCharge : settings.codCharge;

        if (req.body.socialLinks) {
            settings.socialLinks = {
                ...settings.socialLinks,
                ...req.body.socialLinks
            };
        }

        if (req.body.authImages) {
            settings.authImages = req.body.authImages;
        }

        const updatedSettings = await settings.save();
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
