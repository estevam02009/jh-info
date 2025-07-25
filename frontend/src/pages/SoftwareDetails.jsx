// src/pages/SoftwareDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SoftwareDetails = () => {
    const { id } = useParams();
    const [software, setSoftware] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Apenas precisamos do objeto 'user' para verificar 'hasPaidAccess'

    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchSoftwareDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/softwares/${id}`);
                setSoftware(response.data);
            } catch (err) {
                console.error('Erro ao buscar detalhes do software:', err.response?.data || err.message);
                setError(err.response?.status === 404 ? 'Software não encontrado.' : 'Falha ao carregar detalhes do software.');
            } finally {
                setLoading(false);
            }
        };

        fetchSoftwareDetails();
    }, [id]);

    // Função de download (apenas uma simulação no momento)
    const handleDownload = () => {
        if (!user) {
            alert('Você precisa estar logado para fazer download!');
            navigate('/login');
            return;
        }

        if (!user.hasPaidAccess) {
            alert('Você precisa assinar o acesso para baixar softwares!');
            navigate('/subscribe');
            return;
        }

        // Lógica real de download aqui (ex: redirecionar para um link de download)
        alert(`Iniciando download do software: ${software.name}`);
        console.log(`Usuário ${user.name} (ID: ${user._id}) baixando ${software.name}`);
    };

    if (loading) {
        return <div className="text-center mt-10 text-xl text-gray-700">Carregando detalhes...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600 text-xl">{error}</div>;
    }

    if (!software) {
        return <div className="text-center mt-10 text-gray-500 text-xl">Nenhum software encontrado.</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-xl mt-10 max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{software.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ... (Detalhes do software: Preço, Versão, Categoria, Disponibilidade) ... */}
                <div>
                    <p className="text-sm font-semibold text-gray-600">Preço:</p>
                    <p className="text-2xl text-green-700 font-extrabold">R$ {software.price.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-600">Versão:</p>
                    <p className="text-xl text-gray-800">{software.version}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-600">Categoria:</p>
                    <p className="text-xl text-gray-800">{software.category}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-600">Disponibilidade:</p>
                    {software.isAvailable ? (
                        <span className="inline-block bg-green-200 text-green-800 text-lg px-4 py-1 rounded-full font-bold">Disponível</span>
                    ) : (
                        <span className="inline-block bg-red-200 text-red-800 text-lg px-4 py-1 rounded-full font-bold">Indisponível</span>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">{software.description}</p>
            </div>

            <div className="mt-10 flex justify-between items-center">
                <Link to="/softwares" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md">
                    ← Voltar para a Lista
                </Link>

                {/* Botão de Download Condicional */}
                {user && user.hasPaidAccess && software.isAvailable ? (
                    <button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md"
                    >
                        Fazer Download
                    </button>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">Acesso de download restrito.</p>
                        <Link to="/subscribe" className="text-purple-600 hover:underline font-bold text-sm">
                            Assinar Acesso
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoftwareDetails;