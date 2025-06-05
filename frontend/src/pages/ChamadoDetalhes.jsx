import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
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
    const [anexo, setAnexo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarChamado();
    }, [id]);

    const carregarChamado = async () => {
        try {
            const res = await axios.get(`http://localhost:8001/api/chamados/${id}/`, {
                headers: {Authorization: `Bearer ${token}`},
            });

            if (usuario.tipo_usuario === 'cliente' && res.data.usuario !== usuario.id) {
                toast.error('Acesso negado.');
                navigate('/');
            } else {
                setChamado(res.data);
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar chamado.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

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
            carregarChamado();
        } catch (err) {
            console.error(err);
            toast.error('Erro ao enviar comentário.');
        }
    };

    const enviarAnexo = async () => {
        if (!anexo) return;

        const formData = new FormData();
        formData.append('chamado', chamado.id);
        formData.append('arquivo', anexo);

        try {
            await axios.post('http://localhost:8001/api/anexos/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAnexo(null);
            carregarChamado();
            toast.success('Anexo enviado com sucesso!');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao enviar anexo.');
        }
    };

    const deletarAnexo = (anexoId) => {
        toast(
            ({closeToast}) => (
                <div className="text-white">
                    <p>Deseja realmente excluir este anexo?</p>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => {
                                confirmarExclusao(anexoId);
                                closeToast();
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                            Sim
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
            {
                className: 'bg-gray-800',
                autoClose: false,
                closeOnClick: false,
            }
        );
    };

    const confirmarExclusao = async (anexoId) => {
        try {
            await axios.delete(`http://localhost:8001/api/anexos/${anexoId}/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            toast.success('Anexo excluído com sucesso!');
            carregarChamado();
        } catch (err) {
            console.error(err);
            toast.error('Erro ao excluir anexo.');
        }
    };

    const deletarComentario = (comentarioId) => {
        toast(
            ({closeToast}) => (
                <div className="text-white">
                    <p>Deseja excluir este comentário?</p>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => {
                                confirmarExclusaoComentario(comentarioId);
                                closeToast();
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                            Sim
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
            {
                className: 'bg-gray-800',
                autoClose: false,
                closeOnClick: false,
            }
        );
    };

    const confirmarExclusaoComentario = async (comentarioId) => {
        try {
            await axios.delete(`http://localhost:8001/api/comentarios/${comentarioId}/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            toast.success('Comentário excluído com sucesso!');
            carregarChamado();
        } catch (err) {
            console.error(err);
            toast.error('Erro ao excluir comentário.');
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
            carregarChamado();
            toast.success(`Status alterado para ${novoStatus.replace('_', ' ')}`);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao alterar status.');
        }
    };

    if (loading)
        return (
            <>
                <Header/>
                <p className="text-center text-white bg-gray-900 min-h-screen p-10">Carregando chamado...</p>
                <Footer/>
            </>
        );

    if (!chamado)
        return (
            <>
                <Header/>
                <p className="text-center text-white bg-gray-900 min-h-screen p-10">Chamado não encontrado.</p>
                <Footer/>
            </>
        );

    return (
        <>
            <Header/>
            <main className="min-h-screen bg-gray-900 text-white px-4 py-10 flex justify-center">
                <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">Chamado: {chamado.titulo}</h2>
                    <p><strong>Status:</strong> {chamado.status}</p>
                    <p><strong>Prioridade:</strong> {chamado.prioridade}</p>
                    <p><strong>Categoria:</strong> {chamado.categoria || 'Não especificada'}</p>
                    <p className="mb-6"><strong>Descrição:</strong><br/>{chamado.descricao}</p>

                    <h3 className="text-xl font-semibold mb-3">Comentários</h3>
                    {chamado.comentarios?.length > 0 ? (
                        <ul className="space-y-2 mb-4">
                            {chamado.comentarios.map(com => (
                                <li key={com.id} className="bg-gray-700 p-3 rounded flex justify-between items-start">
                                    <div>
                                        <strong>{com.usuario_nome || com.usuario}</strong>: {com.mensagem}
                                    </div>
                                    {com.usuario === usuario.id && (
                                        <button
                                            onClick={() => deletarComentario(com.id)}
                                            className="text-red-500 text-sm ml-4 hover:underline"
                                        >
                                            Excluir
                                        </button>
                                    )}
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
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4"
                        rows={3}
                    />
                    <button
                        onClick={enviarComentario}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4"
                    >
                        Enviar comentário
                    </button>

                    <h3 className="text-xl font-semibold mb-3">Anexos</h3>
                    {chamado.anexos?.length > 0 ? (
                        <ul className="mb-4 space-y-4">
                            {chamado.anexos.map(anexo => (
                                <li key={anexo.id} className="border border-gray-700 rounded p-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <a
                                            href={anexo.arquivo.startsWith('http') ? anexo.arquivo : `http://localhost:8001${anexo.arquivo}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-400 underline break-all"
                                        >
                                            {anexo.arquivo.split('/').pop()}
                                        </a>
                                        <button
                                            onClick={() => deletarAnexo(anexo.id)}
                                            className="ml-4 text-sm text-red-500 hover:underline"
                                        >
                                            Excluir
                                        </button>
                                    </div>

                                    {/* Exibir imagem se for tipo visual */}
                                    {/\.(jpe?g|png|gif|bmp|webp)$/i.test(anexo.arquivo) && (
                                        <img
                                            src={anexo.arquivo.startsWith('http') ? anexo.arquivo : `http://localhost:8001${anexo.arquivo}`}
                                            alt="Anexo"
                                            className="max-w-full max-h-96 rounded"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 mb-4">Nenhum anexo enviado.</p>
                    )}

                    <input
                        type="file"
                        onChange={e => setAnexo(e.target.files[0])}
                        className="w-full bg-gray-700 p-2 mb-2 text-white"
                    />
                    <button
                        onClick={enviarAnexo}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-4"
                    >
                        Enviar anexo
                    </button>

                    {usuario.tipo_usuario === 'tecnico' && chamado.status !== 'fechado' && (
                        <button
                            onClick={alterarStatus}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded mb-4"
                        >
                            Avançar status ({chamado.status === 'aberto' ? '→ Em andamento' : '→ Fechado'})
                        </button>
                    )}

                    <button
                        onClick={() => navigate(usuario.tipo_usuario === 'cliente' ? '/cliente' : '/tecnico')}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                    >
                        Voltar
                    </button>
                </div>
            </main>
            <Footer/>
        </>
    );
}
