import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center">

            {/* Seção Principal (Hero) */}
            <div className='bg-gray-800 text-white w-full py-20 px-4 text-center rounded-b-xl shadow-lg'>
                <h1 className='text-5xl md:text-6xl font-extrabold leading-tight mb-4'>
                    Bem vindos a JH Informática
                </h1>
                <p className='text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8'>
                    Conectando você ao mundo digital sem interrupções. Oferecemos soluções rápidas e eficientes para todos os seus problemas de software e hardware.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link 
                        to="/softwares" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
                    >
                        Ver Softwares
                    </Link>
                    <Link 
                        to="/subscribe" 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
                    >
                        Assinar Acesso
                    </Link>
                </div>
            </div>

            {/* Seção nossos serviços */}
            <div className="container mx-auto py-16 px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Nossos Serviços</h2>
                <p>
                    Diagnosticamos e consertamos componentes defeituosos, como placas-mãe, discos rígidos, e fontes de alimentação.
                </p>
            </div>
        </div>
    )
}

export default Home;