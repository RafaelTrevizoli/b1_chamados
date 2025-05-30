import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import Cliente from './pages/Cliente';
import Tecnico from './pages/Tecnico';
import NovoChamado from './pages/NovoChamado';
import ChamadoDetalhes from './pages/ChamadoDetalhes';


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/registrar" element={<Registrar/>}/>
            <Route path="/cliente" element={<Cliente/>}/>
            <Route path="/tecnico" element={<Tecnico/>}/>
            <Route path="/cliente/novo" element={<NovoChamado/>}/>
            <Route path="/cliente/chamado/:id" element={<ChamadoDetalhes />} />
            <Route path="/tecnico/chamado/:id" element={<ChamadoDetalhes />} />
        </Routes>
    );
}
