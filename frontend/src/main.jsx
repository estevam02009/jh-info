// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Para estilos globais
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Contexto de Autenticação

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider> {/* O AuthProvider envolve toda a aplicação */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);