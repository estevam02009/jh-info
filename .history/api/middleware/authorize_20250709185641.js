// middlewares/authorize.js
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para acessar esta rota' });
        }
        next();
    };
};

module.exports = { authorize };