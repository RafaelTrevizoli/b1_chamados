import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Tecnico() {
  const { usuario, token, logout } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({
    status: '',
    prioridade: '',
    categoria: '',
    busca: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || usuario.tipo_usuario !== 'tecnico') {
      alert('Acesso restrito.');
      navigate('/');
      return;
    }

    axios
      .get('http://localhost:8001/api/categorias/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCategorias(res.data));

    carregarChamados();
  }, [usuario]);

  const carregarChamados = () => {
    const params = new URLSearchParams();
    if (filtro.status) params.append('status', filtro.status);
    if (filtro.prioridade) params.append('prioridade', filtro.prioridade);
    if (filtro.categoria) params.append('categoria', filtro.categoria);
    if (filtro.busca) params.append('search', filtro.busca);

    axios
      .get(`http://localhost:8001/api/chamados/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const atribuidos = res.data.filter(c => c.tecnico === usuario.id);
        setChamados(atribuidos);
      })
      .catch(() => alert('Erro ao carregar chamados.'));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-400">Painel do Técnico</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              carregarChamados();
            }}
            className="mb-6 flex flex-wrap gap-4"
          >
            <select
              onChange={e => setFiltro({ ...filtro, status: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Status</option>
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em andamento</option>
              <option value="fechado">Fechado</option>
            </select>

            <select
              onChange={e => setFiltro({ ...filtro, prioridade: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Prioridade</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>

            <select
              onChange={e => setFiltro({ ...filtro, categoria: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Buscar por título"
              onChange={e => setFiltro({ ...filtro, busca: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Filtrar
            </button>
          </form>

          {chamados.length === 0 ? (
            <p className="text-gray-400">Nenhum chamado encontrado.</p>
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
