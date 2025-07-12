// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchma = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'email'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});