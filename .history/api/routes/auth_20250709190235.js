// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('../middleware/auth');

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
    
    try {} catch (error) {}
});