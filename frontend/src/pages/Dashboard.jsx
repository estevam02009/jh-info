// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [errorUsers, setErrorUsers] = useState(null);

    const API_URL = 'http://localhost:5000/api'; // Certifique-se que a porta está correta

    const fetchUsers = async () => {
        if (user?.role === 'admin') {
            setLoadingUsers(true);
            setErrorUsers(null);
            try {
                const response = await axios.get(`${API_URL}/users`);
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error.response?.data || error.message);
                setErrorUsers(error.response?.data?.message || 'Falha ao carregar usuários.');
            } finally {
                setLoadingUsers(false);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user]);

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Dashboard</h2>
                {user ? (
                    <>
                        <p className="text-xl text-gray-700 mb-4 text-center">
                            Bem-vindo, <span className="font-semibold text-blue-600">{user.name}</span>! (Função: <span className="font-semibold text-purple-600">{user.role}</span>)
                        </p>
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                Sair
                            </button>
                        </div>

                        {user.role === 'admin' && (
                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">Gerenciamento de Usuários (Apenas Admin)</h3>
                                <div className="flex justify-center mb-6">
                                    <button
                                        onClick={fetchUsers}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        Recarregar Usuários
                                    </button>
                                </div>
                                {loadingUsers && <p className="text-center text-blue-500 text-lg">Carregando usuários...</p>}
                                {errorUsers && <p className="text-red-500 text-center text-lg">{errorUsers}</p>}
                                {users.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                            <thead>
                                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">Nome</th>
                                                <th className="py-3 px-6 text-left">Email</th>
                                                <th className="py-3 px-6 text-left">Função</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-sm font-light">
                                            {users.map((u) => (
                                                <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">{u.name}</td>
                                                    <td className="py-3 px-6 text-left">{u.email}</td>
                                                    <td className="py-3 px-6 text-left">{u.role}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    !loadingUsers && !errorUsers && <p className="text-center text-gray-600 text-lg">Nenhum usuário encontrado (ou você não é admin).</p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-600 text-lg">Você não está logado.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;