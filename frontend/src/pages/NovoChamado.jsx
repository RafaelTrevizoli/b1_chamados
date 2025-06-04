import React, {useState, useEffect, useContext} from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NovoChamado() {
    const {usuario, token} = useContext(AuthContext);
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [form, setForm] = useState({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        categoria: '',
        tecnico: '',
    });

    useEffect(() => {
        axios
            .get('http://localhost:8001/api/categorias/', {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then(res => setCategorias(res.data));

        axios
            .get('http://localhost:8001/api/usuarios/', {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then(res => {
                const listaTecnicos = res.data.filter(user => user.tipo_usuario === 'tecnico');
                setTecnicos(listaTecnicos);
            });
    }, [token]);

    const criarChamado = async () => {
        try {
            await axios.post(
                'http://localhost:8001/api/chamados/',
                {
                    ...form,
                    usuario: usuario.id,
                    status: 'aberto',
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            toast.success('Chamado criado com sucesso!')
            navigate('/cliente');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao criar chamado.');
        }
    };

    return (
        <>
            <Header/>
            <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-10">
                <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Novo Chamado</h2>

                    <input
                        type="text"
                        placeholder="Título"
                        className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setForm({...form, titulo: e.target.value})}
                    />

                    <textarea
                        placeholder="Descrição"
                        className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setForm({...form, descricao: e.target.value})}
                    />

                    <select
                        className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setForm({...form, prioridade: e.target.value})}
                    >
                        <option value="baixa">Prioridade: Baixa</option>
                        <option value="media">Prioridade: Média</option>
                        <option value="alta">Prioridade: Alta</option>
                    </select>

                    <select
                        className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setForm({...form, categoria: e.target.value})}
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nome}</option>
                        ))}
                    </select>

                    <select
                        className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setForm({...form, tecnico: e.target.value})}
                    >
                        <option value="">Atribuir Técnico</option>
                        {tecnicos.map(tec => (
                            <option key={tec.id} value={tec.id}>{tec.nome}</option>
                        ))}
                    </select>

                    <button
                        onClick={criarChamado}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors duration-200"
                    >
                        Criar Chamado
                    </button>
                </div>
            </main>
            <Footer/>
        </>
    );
}
