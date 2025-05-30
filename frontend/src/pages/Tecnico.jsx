import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Tecnico() {
  const { usuario, token, logout } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || usuario.tipo_usuario !== 'tecnico') {
      alert('Acesso restrito.');
      navigate('/');
      return;
    }

    axios
      .get('http://localhost:8001/api/chamados/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const atribuídos = res.data.filter(c => c.tecnico === usuario.id);
        setChamados(atribuídos);
      })
      .catch(() => alert('Erro ao carregar chamados.'));
  }, [usuario, token, navigate]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-400">Painel do Técnico</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>

          {chamados.length === 0 ? (
            <p className="text-gray-400">Nenhum chamado atribuído.</p>
          ) : (
            <ul className="space-y-4">
              {chamados.map(c => (
                <li
                  key={c.id}
                  className="bg-gray-700 p-4 rounded flex flex-col md:flex-row md:justify-between md:items-center"
                >
                  <div>
                    <strong className="text-lg">{c.titulo}</strong>
                    <p className="text-sm text-gray-400">Status: {c.status}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/tecnico/chamado/${c.id}`)}
                    className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Ver detalhes
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
