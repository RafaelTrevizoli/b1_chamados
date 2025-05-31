import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

export default function Header() {
    const {usuario, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow">
            <h1
                className="text-xl font-bold cursor-pointer"
                onClick={() =>
                    navigate(usuario?.tipo_usuario === 'tecnico' ? '/tecnico' : '/cliente')
                }
            >
                Sistema de Chamados
            </h1>

            {usuario && (
                <div className="flex items-center gap-4">
                    <span className="text-sm hidden sm:inline">Olá, {usuario.nome}</span>
                    <button
                        onClick={logout}
                        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-sm"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}
