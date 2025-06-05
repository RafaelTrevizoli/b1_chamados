'use client';
import React, {createContext, useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const login = (userData, jwtToken) => {
        setUsuario(userData);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('usuario', JSON.stringify(userData));
    };

    const logout = () => {
        toast(
            ({closeToast}) => (
                <div className="text-white">
                    <p>Deseja sair da conta?</p>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => {
                                finalizarLogout();
                                closeToast();
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                            Sair
                        </button>
                        <button
                            onClick={closeToast}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            {className: 'bg-gray-800', autoClose: false, closeOnClick: false}
        );
    };

    const finalizarLogout = () => {
        setUsuario(null);
        setToken('');
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        navigate('/');
    };


    useEffect(() => {
        const tokenSalvo = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');

        if (tokenSalvo && usuarioSalvo) {
            setToken(tokenSalvo);
            setUsuario(JSON.parse(usuarioSalvo));
        }
    }, []);

    return (
        <AuthContext.Provider value={{usuario, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}
