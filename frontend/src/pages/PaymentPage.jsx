// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const { user, token, updateUserAccessStatus } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5000/api';

    const handleSubscribe = async () => {
        if (!user || !token) {
            setMessage('Você precisa estar logado para assinar o acesso.'); // Remove o segundo argumento aqui
            setMessageType('error'); // Adiciona esta linha para setar o tipo
            navigate('/login');
            return;
        }

        if (user.hasPaidAccess) {
            setMessage('Você já possui acesso pago.', 'info');
            return;
        }

        setIsProcessing(true);
        setMessage('');
        setMessageType('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            // Chama a rota de simulação de pagamento na API
            const response = await axios.post(`${API_URL}/payment/subscribe`, {}, config);

            // Atualiza o estado do usuário no AuthContext com os dados atualizados da API
            updateUserAccessStatus(response.data.user);

            setMessage(response.data.message || 'Pagamento realizado com sucesso!', 'success');

            // Opcional: Redirecionar para o dashboard após um breve momento
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (err) {
            console.error('Erro no pagamento:', err.response?.data || err.message);
            setMessage(err.response?.data?.message || 'Erro ao processar pagamento. Tente novamente.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // const setMessage = (text, type) => {
    //     setMessage(text);
    //     setMessageType(type);
    // };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Acesso Premium</h2>
                <p className="text-2xl text-green-600 mb-6">R$ 99,90</p>
                <p className="text-gray-700 mb-8">
                    Pague uma taxa única para ter acesso vitalício a todos os softwares disponíveis para download.
                </p>

                {message && (
                    <div className={`p-4 mb-6 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {message}
                    </div>
                )}

                {user && user.hasPaidAccess ? (
                    <div className="bg-blue-100 text-blue-700 p-4 rounded-md font-bold text-lg">
                        Você já possui acesso pago!
                    </div>
                ) : (
                    <button
                        onClick={handleSubscribe}
                        disabled={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processando Pagamento...' : 'Pagar e Obter Acesso'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;