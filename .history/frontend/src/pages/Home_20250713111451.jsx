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
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full shadow-lg transition duration-300"
                    >
                        Ver Softwares
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;