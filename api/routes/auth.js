// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middlewares/auth');

// Função para gerar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // expira em 1 hora.
    });
};

// @desc Registrar novo Usuário
// @route POST /api/auth/register
// @access Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dados de usuário inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Autenticar usuário e obter token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Obter perfil do usuário
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    // req.user é popúlado pelo middlewares 'protect'
    res.json(req.user);
});

module.exports = router;
