const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Software = require('../models/Software');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// @desc    Obter todos os softwares
// @route   GET /api/softwares
// @access  Public (Qualquer um pode ver a lista de softwares)
router.get('/', async (req, res) => {
    try {
        const software = await Software.find();
        res.json(software);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// @desc    Obter um software por ID
// @route   GET /api/softwares/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const software = await Software.findById(req.params.id);
        if (software) {
            res.json(software);
        } else {
            res.status(404).json({message: 'Nenhum software com esse id'});
        }
    } catch (error) {
        // Se o ID não for um ID válido do MongoDB, mongoose lançará um CastError
        if (error.name === 'CastError') {
            return res.status(500).json({message:'ID de software invalido'});
        }
        res.status(500).json({message: error.message});
    }
});

// @desc    Criar um novo software (Apenas para admins)
// @route   POST /api/softwares
// @access  Private/Admin
router.post('/', protect, authorize(['admin']), async (req, res) => {
    const { name, description, price, version, category, isAvailable } = req.body;

    try {
        const softwareExists = await Software.findOne({ name });
        if (softwareExists) {
            return res.status(400).json({message:'Já existe um software com este nome.'});
        }

        const software = new Software({
            name,
            description,
            price,
            version,
            category,
            isAvailable: isAvailable !== undefined ? isAvailable : true, //Garante que pode ser setado como false
        });

        const createdSoftware = await software.save();
        res.status(201).json(createdSoftware);
    } catch (error) {
        // Erros de validação
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: messages.join(', ') });
        }
        res.status(500).json({message: error.message});
    }
});

// @desc    Atualizar um software (Apenas para admins)
// @route   PUT /api/softwares/:id
// @access  Private/Admin
router.put('/:id', protect, authorize(['admin']), async (req, res) => {
    const { name, description, price, version, category, isAvailable } = req.body;

    try {
        const software = await Software.findById(req.params.id);

        if (software) {
            software.name = name || software.name;
            software.description = description !== undefined ? description : software.description; //Permite limpar descrição
            software.price = price !== undefined ? price : software.price;
            software.version = version || software.version;
            software.category = category || software.category;
            software.isAvailable = isAvailable !== undefined ? isAvailable : software.isAvailable;

            const updatedSoftware = await software.save();
            res.json(updatedSoftware);
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message: 'ID de software inválido.'});
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: messages.join(', ') });
        }
        res.status(500).json({message: error.message});
    }
});

// @desc    Deletar um software (Apenas para admins)
// @route   DELETE /api/softwares/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize(['admin']), async (req, res) => {
    try {
        const software = await Software.findById(req.params.id);
        if (software) {
            await software.deleteOne({ _id: software._id });
            res.json({ message: 'Software removido' });
        } else {
            res.status(404).json({message: 'Software não encontrado'});
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message: 'ID de sotware inválido'});
        }
        res.status(500).json({message: error.message});
    }
});

module.exports = router;