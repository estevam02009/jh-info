const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/auth'); // apenas usuários logados podem "pagar"

// @desc    Simular pagamento e conceder acesso pago
// @route   POST /api/payment/subscribe
// @access  Private
router.post('/subscribe', protect, async (req, res) => {
    try {
        // Encontra o usuário logado via req.user.id (do middleware 'protect')
        // Usamos .findByIdAndUpdate para atualizar o documento diretamente no banco
        const user = await User.findById(req.user.id).select('+password'); // Precisamos selecionar a senha para evitar erro no save, mesmo que não a retornemos

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' })
        }

        if (user.hasPaidAccess) {
            return res.status(400).json({ message: 'Você já possui acesso pago.' })
        }

        // Atualizar o status de acesso pago para true
        user.hasPaidAccess = true;
        await user.save();

        // Nota: A função 'save' no modelo User (pre-save) pode re-criptografar a senha,
        // o que não queremos. A função `findByIdAndUpdate` é mais segura para isso:

        // Use findByIdAndUpdate para uma atualização mais direta (se não precisar do middleware pre-save)
        // const updatedUser = await User.findByIdAndUpdate(req.user.id, { hasPaidAccess: true }, { new: true, runValidators: true });

        // Para evitar problemas de re-criptografia de senha, vamos usar findByIdAndUpdate aqui:
        const updatedUser = await user.findByIdAndUpdate(
            req.user.id,
            { hasPaidAccess: true },
            { new: true, runValidators: true }
        ).select('-password'); // Seleciona tudo exceto a senha para a resposta

        res.status(200).json({
            message: 'Pagamento processado com sucesso! Acesso concedido.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Erro ao processar pagamento', error);
        res.status(400).json({ message: 'Erro interno do servidor.'});
    }
});

module.exports = router;