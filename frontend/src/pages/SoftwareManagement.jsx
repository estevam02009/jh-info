// src/pages/SoftwareManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Para obter o token do admin

const SoftwareManagement = () => {
    const { user, token } = useAuth();
    const [softwares, setSoftwares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Estado para o formulário de adição/edição
    const [currentSoftware, setCurrentSoftware] = useState({
        _id: null, // Para identificar se estamos editando ou adicionando
        name: '',
        description: '',
        price: '',
        version: '',
        category: 'Outros',
        isAvailable: true,
    });

    const API_URL = 'http://localhost:5000/api';

    // Função para buscar todos os softwares (para a lista)
    const fetchSoftwares = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/softwares`);
            setSoftwares(response.data);
        } catch (err) {
            console.error('Erro ao buscar softwares:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Falha ao carregar softwares.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Apenas admins podem acessar esta página, então o token deve estar presente
        if (user && user.role === 'admin') {
            fetchSoftwares();
        } else {
            setLoading(false);
            setError('Acesso negado. Você precisa ser um administrador.');
        }
    }, [user]); // Dependência do usuário para recarregar se o estado de auth mudar

    // Lidar com mudanças nos campos do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentSoftware((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Lidar com o envio do formulário (Adicionar/Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (currentSoftware._id) {
                // Editar software existente
                const { _id, ...dataToUpdate } = currentSoftware;
                await axios.put(`${API_URL}/softwares/${_id}`, dataToUpdate, config);
                setSuccessMessage('Software atualizado com sucesso!');
            } else {
                // Adicionar novo software
                await axios.post(`${API_URL}/softwares`, currentSoftware, config);
                setSuccessMessage('Software adicionado com sucesso!');
            }
            // Limpar formulário e recarregar a lista
            setCurrentSoftware({
                _id: null,
                name: '',
                description: '',
                price: '',
                version: '',
                category: 'Outros',
                isAvailable: true,
            });
            fetchSoftwares();
        } catch (err) {
            console.error('Erro ao salvar software:', err.response?.data || err.message);
            setFormError(err.response?.data?.message || 'Erro ao salvar software.');
        }
    };

    // Função para preencher o formulário para edição
    const handleEdit = (software) => {
        setCurrentSoftware({ ...software, price: software.price.toString() }); // Converter preço para string para o input
        setFormError(null);
        setSuccessMessage(null);
    };

    // Função para deletar um software
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este software?')) {
            return;
        }
        setFormError(null);
        setSuccessMessage(null);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.delete(`${API_URL}/softwares/${id}`, config);
            setSuccessMessage('Software excluído com sucesso!');
            fetchSoftwares(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao excluir software:', err.response?.data || err.message);
            setFormError(err.response?.data?.message || 'Erro ao excluir software.');
        }
    };

    if (loading) {
        return <div className="text-center mt-10 text-xl text-gray-700">Carregando gerenciamento de softwares...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600 text-xl">{error}</div>;
    }

    // Se o usuário não for admin, ele será redirecionado pelo ProtectedRoute,
    // mas esta verificação extra é para clareza.
    if (!user || user.role !== 'admin') {
        return <div className="text-center mt-10 text-red-600 text-xl">Acesso negado. Você não tem permissão para acessar esta página.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Gerenciamento de Softwares</h2>

            {/* Formulário de Adição/Edição */}
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {currentSoftware._id ? 'Editar Software' : 'Adicionar Novo Software'}
                </h3>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={currentSoftware.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descrição:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={currentSoftware.description}
                            onChange={handleChange}
                            rows="3"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Preço:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={currentSoftware.price}
                            onChange={handleChange}
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="version">Versão:</label>
                        <input
                            type="text"
                            id="version"
                            name="version"
                            value={currentSoftware.version}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Categoria:</label>
                        <select
                            id="category"
                            name="category"
                            value={currentSoftware.category}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Sistema Operacional">Sistema Operacional</option>
                            <option value="Produtividade">Produtividade</option>
                            <option value="Design">Design</option>
                            <option value="Utilitário">Utilitário</option>
                            <option value="Jogos">Jogos</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={currentSoftware.isAvailable}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                        <label className="text-gray-700 text-sm font-bold" htmlFor="isAvailable">Disponível para Venda</label>
                    </div>
                    <div className="flex justify-between space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-grow"
                        >
                            {currentSoftware._id ? 'Atualizar Software' : 'Adicionar Software'}
                        </button>
                        {currentSoftware._id && (
                            <button
                                type="button"
                                onClick={() => setCurrentSoftware({ _id: null, name: '', description: '', price: '', version: '', category: 'Outros', isAvailable: true })}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar Edição
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de Softwares Existentes */}
            <div className="mt-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Softwares Cadastrados</h3>
                {softwares.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">Nenhum software cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versão</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {softwares.map((software) => (
                                <tr key={software._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{software.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">R$ {software.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{software.version}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{software.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {software.isAvailable ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Não</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(software)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(software._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoftwareManagement;