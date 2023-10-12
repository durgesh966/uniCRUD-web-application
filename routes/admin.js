// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../DB/models/User'); // Assuming your user model path is correct

// Authentication and authorization middleware
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) { // Assuming isAdmin is a property in your user schema
        return next();
    }
    res.redirect('/');
}

// Admin dashboard route
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// User management route
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().lean();
        res.render('admin/users', { users });
    } catch (error) {
        res.render('error', { error: error.message });
    }
});

// Delete user route
router.post('/delete/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        res.render('error', { error: error.message });
    }
});

// Add more admin routes as needed

module.exports = router;
