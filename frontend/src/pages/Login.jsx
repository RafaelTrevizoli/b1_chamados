import React, {useState, useContext} from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const logar = async () => {
        try {
            const resToken = await axios.post('http://localhost:8001/api/token/', {
                email,
                password: senha,
            });

            const accessToken = resToken.data.access;

            const resUser = await axios.get('http://localhost:8001/api/usuarios/', {
                headers: {Authorization: `Bearer ${accessToken}`},
            });

            const usuario = resUser.data.find(user => user.email === email);
            if (!usuario) {
                toast.error('Email ou senha inválidos.');
                return;
            }

            login(usuario, accessToken);

            if (usuario.tipo_usuario === 'cliente') {
                toast.success('Login realizado com sucesso!');
                navigate('/cliente');
            } else {
                toast.success('Login realizado com sucesso!');
                navigate('/tecnico');
            }
        } catch (err) {
            toast.error('Email ou senha inválidos.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => setSenha(e.target.value)}
                />
                <button
                    onClick={logar}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200"
                >
                    Entrar
                </button>
                <p className="mt-4 text-center text-sm text-gray-400">
                    Não tem conta?{' '}
                    <span
                        className="text-blue-400 hover:underline cursor-pointer"
                        onClick={() => navigate('/registrar')}
                    >
            Registrar
          </span>
                </p>
            </div>
        </div>
    );
}
