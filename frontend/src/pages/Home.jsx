import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h[calc(100vh - 100px)] bg-gray-50 p-4">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 animate-bounce">Bem vindo ao nosso App.</h1>
            <p className="text-xl text-gray-700 mb-8 max-w-xl text-center">Use os links acima para navegar</p>

            <div className="space-x-4">
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md rover:bg-blue-700 transition duration-300">
                    Fazer Login
                </Link>
                <Link to="/register" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md rover:bg-blue-700 transition duration-300">
                    Criar Conta
                </Link>
            </div>
        </div>
    )
}

export default Home;