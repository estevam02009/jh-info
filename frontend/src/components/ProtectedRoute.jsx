// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>; // Ou um spinner/componente de loading
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Redireciona para login se não estiver autenticado
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Redireciona para home ou tela de acesso negado
    }

    return <Outlet />; // Renderiza os componentes filhos da rota protegida
};

export default ProtectedRoute;