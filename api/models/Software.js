const mongoose = require('mongoose');

const SoftwareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome do software é obrigatório'],
        unique: true, // Garante que não haverá duplicação de software
    },
    description: {
        type: String,
        default: 'Nenhuma descrição fornecida.',
    },
    price: {
        type: Number,
        required: [true, 'O preço do software é obrigatório'],
        min: [0, 'O preço não pode ser negativo'],
    },
    version: {
        type: String,
        default: '1.0.0',
    },
    category: {
        type: String, // Poderia ser um array de string se um software puder ter multiplas categorias
        enum: ['Sistema Operacional', 'Produtividade', 'Design', 'Utilitário', 'Jogos', 'Outros'],
        default: 'Outros',
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para atualizar 'updatedAt' antes de salvar
SoftwareSchema.pre('save', async function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Software', SoftwareSchema);