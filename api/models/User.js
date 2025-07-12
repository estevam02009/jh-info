// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido']
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'A senha deve ter pelo menos 8 caracteres'],
        select: false, // Não retorna a senha padrão
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // Campo para controlar o acesso pago
    hasPaidAccess: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metodo para comparar a senha fornecida com a senha do hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);