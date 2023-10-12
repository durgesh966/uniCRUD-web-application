const express = require('express');
const router = express.Router();
const User = require('../config/DB/models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, email, how_heard, city, state, gender, age, phone, address } = req.body;
        const image = req.file ? req.file.filename : null;

        const newUser = await User.create({
            name,
            email,
            how_heard,
            city,
            state,
            gender,
            age,
            phone,
            address,
            image
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return res.status(404).render('error', { error: 'User not found' });
        }
        res.render('userDetails', { user });
    } catch (error) {
        res.render('error', { error: error.message });
    }
});

// Implement other CRUD operations: Read, Update, Delete

module.exports = router;
