// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// @desc    Obter todos os usuários (apenas para admins)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); //mão retorna senha
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Atualizar um usuário (apenas para admins)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', protect, authorize(['admin']), async (req, res) => {
    const { name, email, role } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;

            const updated = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updateUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Deletar um usuário (apenas para admins)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne({ _id: user._id }); // Use deleteOne para remover
            res.json({ message: 'Usuário removido' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;