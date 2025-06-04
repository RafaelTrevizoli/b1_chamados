'use client';
import React, { createContext, useState, useEffect } from 'react';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
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
    setUsuario(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    toast.error('Você saiu!');

    setTimeout(() => navigate('/'), 0);
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
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
