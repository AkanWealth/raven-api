const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// User registration/sign-up (support both endpoints)
router.post('/register', authController.signup);
router.post('/signup', authController.signup);

// User login
router.post('/login', authController.login);

// Example protected route
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Authenticated user', user: req.user });
});

module.exports = router;
