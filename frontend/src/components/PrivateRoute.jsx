import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ tipoPermitido }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (tipoPermitido && usuario.tipo_usuario !== tipoPermitido) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
