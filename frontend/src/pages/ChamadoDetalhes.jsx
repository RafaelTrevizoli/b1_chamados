import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ChamadoDetalhes() {
    const {id} = useParams();
    const {token, usuario} = useContext(AuthContext);
    const navigate = useNavigate();

    const [chamado, setChamado] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarChamado = async () => {
            try {
                const res = await axios.get(`http://localhost:8001/api/chamados/${id}/`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (usuario.tipo_usuario === 'cliente' && res.data.usuario !== usuario.id) {
                    alert('Acesso negado.');
                    navigate('/');
                } else {
                    setChamado(res.data);
                }
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar chamado.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        carregarChamado();
    }, [id, token, usuario, navigate]);

    const enviarComentario = async () => {
        if (!mensagem.trim()) return;

        try {
            await axios.post(
                'http://localhost:8001/api/comentarios/',
                {
                    chamado: chamado.id,
                    usuario: usuario.id,
                    mensagem: mensagem,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            setMensagem('');
            const res = await axios.get(`http://localhost:8001/api/chamados/${id}/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setChamado(res.data);
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar comentário.');
        }
    };

    const alterarStatus = async () => {
        const novoStatus =
            chamado.status === 'aberto'
                ? 'em_andamento'
                : chamado.status === 'em_andamento'
                    ? 'fechado'
                    : 'fechado';

        try {
            await axios.patch(
                `http://localhost:8001/api/chamados/${chamado.id}/`,
                {status: novoStatus},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            const res = await axios.get(`http://localhost:8001/api/chamados/${chamado.id}/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setChamado(res.data);
        } catch (err) {
            console.error(err);
            alert('Erro ao alterar status.');
        }
    };

    if (loading)
        return (
            <>
                <Header/>
                <p className="text-center text-white bg-gray-900 min-h-screen p-10">
                    Carregando chamado...
                </p>
                <Footer/>
            </>
        );

    if (!chamado)
        return (
            <>
                <Header/>
                <p className="text-center text-white bg-gray-900 min-h-screen p-10">
                    Chamado não encontrado.
                </p>
                <Footer/>
            </>
        );

    return (
        <>
            <Header/>
            <main className="min-h-screen bg-gray-900 text-white px-4 py-10 flex justify-center">
                <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Chamado: {chamado.titulo}
                    </h2>
                    <p className="mb-1">
                        <strong>Status:</strong> {chamado.status}
                    </p>
                    <p className="mb-1">
                        <strong>Prioridade:</strong> {chamado.prioridade}
                    </p>
                    <p className="mb-1">
                        <strong>Categoria:</strong> {chamado.categoria || 'Não especificada'}
                    </p>
                    <p className="mb-4">
                        <strong>Descrição:</strong>
                    </p>
                    <p className="bg-gray-700 p-4 rounded whitespace-pre-wrap mb-6">
                        {chamado.descricao}
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Comentários</h3>
                    {chamado.comentarios && chamado.comentarios.length > 0 ? (
                        <ul className="space-y-2 mb-4">
                            {chamado.comentarios.map(com => (
                                <li key={com.id} className="bg-gray-700 p-3 rounded">
                                    <strong>{com.usuario_nome}</strong>: {com.mensagem}
                                </li>
                            ))}

                        </ul>
                    ) : (
                        <p className="text-gray-400 mb-4">Sem comentários ainda.</p>
                    )}

                    <textarea
                        placeholder="Escreva um comentário..."
                        value={mensagem}
                        onChange={e => setMensagem(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded placeholder-gray-400 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                        onClick={enviarComentario}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition mb-4"
                    >
                        Enviar comentário
                    </button>

                    {usuario.tipo_usuario === 'tecnico' && chamado.status !== 'fechado' && (
                        <button
                            onClick={alterarStatus}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded transition mb-4"
                        >
                            Avançar status (
                            {chamado.status === 'aberto' ? '→ Em andamento' : '→ Fechado'})
                        </button>
                    )}

                    <button
                        onClick={() =>
                            navigate(usuario.tipo_usuario === 'cliente' ? '/cliente' : '/tecnico')
                        }
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition"
                    >
                        Voltar
                    </button>
                </div>
            </main>
            <Footer/>
        </>
    );
}
