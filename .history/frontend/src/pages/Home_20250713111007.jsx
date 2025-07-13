import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center">

            {/* Seção Principal (Hero) */}
            <div className='bg-gray-800 text-wite w-full py-20 px-4 text-center rounded-b-xl shadow-lg'>
                <h1 className='text-5xl md:text-6xl font-extrabold leading-tight mb-4'>
                    Manutenção profissional de computadores
                </h1>
            </div>
        </div>
    )
}

export default Home;