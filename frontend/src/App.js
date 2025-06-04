import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import Cliente from './pages/Cliente';
import Tecnico from './pages/Tecnico';
import NovoChamado from './pages/NovoChamado';
import ChamadoDetalhes from './pages/ChamadoDetalhes';
import PrivateRoute from './components/PrivateRoute';
import {ToastContainer} from 'react-toastify';


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/registrar" element={<Registrar/>}/>

                <Route element={<PrivateRoute tipoPermitido="cliente"/>}>
                    <Route path="/cliente" element={<Cliente/>}/>
                    <Route path="/cliente/novo" element={<NovoChamado/>}/>
                    <Route path="/cliente/chamado/:id" element={<ChamadoDetalhes/>}/>
                </Route>

                <Route element={<PrivateRoute tipoPermitido="tecnico"/>}>
                    <Route path="/tecnico" element={<Tecnico/>}/>
                    <Route path="/tecnico/chamado/:id" element={<ChamadoDetalhes/>}/>
                </Route>
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                pauseOnHover
                theme="dark"
            />
        </>
    );
}

export default App;
