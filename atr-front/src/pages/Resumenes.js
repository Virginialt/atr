import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import SubirResumen from '../components/SubirResumen';
import ResumenCard from '../components/ResumenCard';
import ModalResumen from '../components/ModalResumen';
import Header from '../components/Header';
import { isAuthenticated, API_BASE } from '../api';

const Resumenes = () => {
  const navigate = useNavigate();
  const [resumenes, setResumenes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [materiaFiltro, setMateriaFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSubir, setMostrarSubir] = useState(false);
  const [resumenModal, setResumenModal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [orden, setOrden] = useState('fecha_desc');

  useEffect(() => {
    fetch(`${API_BASE}/materia`)
      .then(r => r.json())
      .then(setMaterias)
      .catch(() => {});
  }, [navigate]);

  const cargarResumenes = useCallback(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (materiaFiltro) params.append('materiaId', materiaFiltro);
    if (busqueda) params.append('buscar', busqueda);
    const query = params.toString();
    fetch(`${API_BASE}/resumenes${query ? '?' + query : ''}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setResumenes(data))
      .catch(() => setResumenes([]))
      .finally(() => setCargando(false));
  }, [materiaFiltro, busqueda]);

  useEffect(() => {
    cargarResumenes();
  }, [cargarResumenes]);

  const resumenesOrdenados = [...resumenes].sort((a, b) => {
    switch (orden) {
      case 'fecha_asc': return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'fecha_desc': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'puntaje_desc': return (b.promedioPuntaje || 0) - (a.promedioPuntaje || 0);
      case 'puntaje_asc': return (a.promedioPuntaje || 0) - (b.promedioPuntaje || 0);
      default: return 0;
    }
  });

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
      minHeight: '100vh', color: 'white', fontFamily: 'Open Sans, sans-serif'
    }}>
      <Header />

      <div style={{ padding: '95px 5% 50px', animation: 'fadeIn 0.3s ease' }}>
        {!mostrarSubir && (
          <button onClick={() => { if (isAuthenticated()) { setMostrarSubir(true); } else { navigate('/login'); } }}
            className="btn btn-lg" style={{ marginBottom: '20px' }}>
            + Subir resumen
          </button>
        )}

        {mostrarSubir && (
          <SubirResumen onCreado={() => { setMostrarSubir(false); cargarResumenes(); }}
                        onCancelar={() => setMostrarSubir(false)} />
        )}

        <div className="filter-bar">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar resúmenes..." value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ width: '280px' }} />
            <select value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)}>
              <option value="">Todas las materias</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            <select value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="fecha_desc">Más recientes</option>
              <option value="fecha_asc">Más antiguos</option>
              <option value="puntaje_desc">Mejor puntuados</option>
              <option value="puntaje_asc">Peor puntuados</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div className="empty-state">
            <div className="spinner" />
            <p style={{ marginTop: '16px' }}>Cargando resúmenes...</p>
          </div>
        ) : resumenes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p className="empty-state-title">No hay resúmenes todavía.</p>
            <p className="empty-state-text">¡Subí el primero!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'
          }}>
            {resumenesOrdenados.map(r => (
              <ResumenCard key={r.id} resumen={r} onValorado={cargarResumenes} onEliminado={cargarResumenes} onVer={setResumenModal} />
            ))}
          </div>
        )}
        {resumenModal && (
          <ModalResumen resumen={resumenModal} onCerrar={() => setResumenModal(null)} onValorado={cargarResumenes} />
        )}
      </div>
    </div>
  );
};

export default Resumenes;
