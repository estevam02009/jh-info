import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const SoftwareList = () => {
    const [softwares, setSoftwares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchSoftwares = async () => {
            try {
                const response = await axios.get(`${API_URL}/softwares`);
                setSoftwares(response.data);
            } catch (err) {
                console.error('Erro ao buscar softwares:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'falha ao carregar software.');
            } finally {
                setLoading(false);
            }
        };

        fetchSoftwares();
    }, []);

    if (loading) {
        return(
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-700">Carregando Softwares...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-700">Erro: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Softwares Disponiveis

                {softwares.length === 0 ? (
                   <p className="text-center text-gray-600 text-lg">Nenhum software disponivel no momento</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {softwares.map((software) => (
                            <div key={software._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-semibold text-blue-700 mb-2">{software.name}</h3>
                                    <p className="text-gray-600 mb-4">{software.description}</p>
                                    <p className="text-lg font-bold text-green-600 mb-2">{software.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">Versão: {software.version}</p>
                                    <p className="text-sm text-gray-500">Categoria: {software.category}</p>
                                </div>
                                <div className="mt-4">
                                    {software.isAvailable ? (
                                        <span className="inline-block bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-semibold mr-1">Disponivel</span>
                                    ) : (
                                        <span className="inline-block bg-red-200 text-red-800 text-xs px-3 py-1 rounded-full font-semibold">Indisponivel</span>
                                    )}

                                    {/* Botão ou link para a página de detalhes */}
                                    <Link
                                        to={`/softwares/${software._id}`}
                                        className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded transition duration-300 shadow-sm"
                                    >
                                        Ver Detalhes
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </h2>
        </div>
    )
}

export default SoftwareList;