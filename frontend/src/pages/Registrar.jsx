import React, { useState } from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Registrar() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    tipo_usuario: '',
  });
  const navigate = useNavigate();

  const registrar = async () => {
    try {
      await axios.post('http://localhost:8001/api/usuarios/', form);
      toast.success('Registro realizado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao se registrar!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Registrar</h1>

        <input
          type="text"
          placeholder="Nome"
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setForm({ ...form, tipo_usuario: e.target.value })}
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="cliente">Cliente</option>
          <option value="tecnico">Técnico</option>
        </select>

        <button
          onClick={registrar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200"
        >
          Registrar
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate('/')}
          >
            Entrar
          </span>
        </p>
      </div>
    </div>
  );
}
