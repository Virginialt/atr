import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Registro from './pages/Registro';
import Resumenes from './pages/Resumenes';
import Comunidad from './pages/Comunidad';
import Bienvenido from './pages/Bienvenido';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/bienvenido" element={<Bienvenido />} />
        <Route path="/resumenes" element={<Resumenes />} />
        <Route path="/comunidad" element={<Comunidad />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;