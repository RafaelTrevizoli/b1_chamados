import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('usuario');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUsuario(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUsuario(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.clear();
    setUsuario(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
