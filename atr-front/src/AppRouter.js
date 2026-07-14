import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Registro from './pages/Registro';
import Resumenes from './pages/Resumenes';
import Comunidad from './pages/Comunidad';
import Bienvenido from './pages/Bienvenido';
import Foro from './pages/Foro';
import ForoDetalle from './pages/ForoDetalle';
import Grupos from './pages/Grupos';
import GrupoDetalle from './pages/GrupoDetalle';
import Mensajes from './pages/Mensajes';
import Perfil from './pages/Perfil';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bienvenido />} />
        <Route path="/login" element={<App />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/resumenes" element={<Resumenes />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/tutores" element={<Comunidad />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="/foro/:id" element={<ForoDetalle />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/grupos/:id" element={<GrupoDetalle />} />
        <Route path="/mensajes" element={<Navigate to="/tutores" replace />} />
        <Route path="/mensajes/:contactoId" element={<Mensajes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
