import React from "react";
import {Link, Routes, Route} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import SoftwareList from "./pages/SoftwareList";
import SoftwareDetails from "./pages/SoftwareDetails";
import SoftwareManagement from "./pages/SoftwareManagement";
import PaymentPage from "./pages/PaymentPage";
import MySoftwares from "./pages/MySoftwares.jsx";
import { useAuth } from "./context/AuthContext";


const App = () => {

    const { user, logout } = useAuth(); // Obtém o estado do usuário e a função de logout

    return (
        <>
            <nav className="bg-blue-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-white text-2xl font-bold">JH Informática</Link>
                    <div>
                        <Link to="/" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link to="/softwares" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Softwares</Link>

                        {/* Link para a página de Pagamento/Assinatura */}
                        {!user?.hasPaidAccess && (
                            <Link to="/subscribe" className="text-green-400 hover:bg-gray-700 hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">Assinar Acesso</Link>
                        )}

                    {/*    Links visiveis apenas se o usuário estiver logado    */}
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                {user.hasPaidAccess && ( // Mostrar "Meus Softwares" apenas se tiver pago
                                    <Link to="/my-softwares" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Meus Softwares</Link>
                                )}
                            {/* Link para gerenciamento de softwares - visivel apenas para admins logados */}
                                {user.role === "admin" && (
                                    <Link to="/admin/softwares" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Gerenciar Softwares</Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-800 px-3 py-2 rounded-md text-sm text-white font-medium ml-4"
                                >Sair</button>
                            </>
                        ) : (

                            <>
                                {/* Links visivéis apenas se o usuário não estiver logado */}
                                <Link to="/login" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="text-gray-300 hover:bg-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Criar Conta</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Conteúdo principal*/}
            <div className="container mx-auto p-4 mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/softwares" element={<SoftwareList />} /> {/* <-- Nova Rota */}
                    <Route path="/softwares/:id" element={<SoftwareDetails />} />

                    {/* Rota para a página de assinatura. É acessível se o usuário estiver logado ou não, mas a lógica de pagamento exige login */}
                    <Route path="/subscribe" element={<PaymentPage />} />

                {/* Rotas protegidas */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />}></Route>
                        <Route path="/my-softwares" element={<MySoftwares />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/softwares" element={<SoftwareManagement />} />
                    </Route>

                    <Route path="*" element={<h2 className="text-4xl font-bold text-red-500">404 - Página não encontrada</h2>}></Route>
                </Routes>
            </div>

            {/* Footer (Rodapé) */}
            <footer className='bg-gray-900 p-4 text-white py-8 px-4 mt-auto'>
                <div className="container mx-auto text-center">
                    <p className="text-lg font-bold mb-2">JH Informática</p>
                    <p className='text-sm text-gray-400 mb-2'>Seu parceiro em manutenção e suporte técnico</p>
                </div>
            </footer>
        </>
    )
}

export default App;
