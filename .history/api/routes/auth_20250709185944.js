// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('../middleware/auth');

// Função para gerar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // expira em 1 hora.
    })
}