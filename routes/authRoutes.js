const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile, getUsers, deleteUser, updateUserBalance } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/balance', protect, admin, updateUserBalance);

module.exports = router;
