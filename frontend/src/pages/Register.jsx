// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await register(name, email, password, role);
            alert('Registro realizado com sucesso! Faça login.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Falha no registro.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Criar Conta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {/*<div>*/}
                    {/*    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Nível de Acesso:</label>*/}
                    {/*    <select*/}
                    {/*        id="role"*/}
                    {/*        value={role}*/}
                    {/*        onChange={(e) => setRole(e.target.value)}*/}
                    {/*        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
                    {/*    >*/}
                    {/*        <option value="user">Usuário</option>*/}
                    {/*        <option value="admin">Admin</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Registrar
                    </button>
                    {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
                </form>
                <p className="text-center text-gray-600 text-sm mt-4">
                    Já tem uma conta? <Link to="/login" className="text-blue-500 hover:underline">Faça login aqui</Link>.
                </p>
            </div>
        </div>
    );
};

export default Register;