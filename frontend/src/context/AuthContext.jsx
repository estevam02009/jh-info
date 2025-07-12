// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Para saber se o token está sendo verificado

    // Base da URL da sua API
    const API_URL = 'http://localhost:5000/api'; // Certifique-se que a porta está correta

    // Carrega o token e usuário do localStorage ao iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Configura o token no cabeçalho padrão do Axios para todas as requisições
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, ...userData } = response.data;
            setToken(token);
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Atualiza o header
            return response.data;
        } catch (error) {
            console.error('Erro de login:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Erro ao fazer login' };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
            // Geralmente, após o registro, você pode logar o usuário automaticamente ou redirecioná-lo para a tela de login
            return response.data;
        } catch (error) {
            console.error('Erro de registro:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Erro ao registrar' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization']; // Remove o header do Axios
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);