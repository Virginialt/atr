import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/img/logoatr.png';
import backgroundImage from '../assets/img/libros.jpg';
import SubirResumen from '../components/SubirResumen';
import ResumenCard from '../components/ResumenCard';
import ModalResumen from '../components/ModalResumen';
import { isAuthenticated } from '../api';

const API_BASE = 'http://localhost:8080/api/v1';

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
      <div style={{
        width: '100%', backgroundColor: 'rgba(117, 28, 28)', padding: '20px',
        position: 'fixed', top: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <img src={logoImage} alt="Logo" style={{ width: '200px', marginLeft: '10px' }} />
        <button onClick={() => navigate('/bienvenido')}
          style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '10px', transition: 'background 0.15s' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      <div style={{ paddingTop: '100px', padding: '120px 5% 50px 5%' }}>
        {!mostrarSubir && (
          <button onClick={() => { if (isAuthenticated()) { setMostrarSubir(true); } else { navigate('/login'); } }}
            style={{
              padding: '14px 28px', backgroundColor: '#4a1010', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold',
              marginBottom: '20px'
            }}>
            + Subir resumen
          </button>
        )}

        {mostrarSubir && (
          <SubirResumen onCreado={() => { setMostrarSubir(false); cargarResumenes(); }}
                        onCancelar={() => setMostrarSubir(false)} />
        )}

        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px', marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar resúmenes..." value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '300px' }} />
            <select value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none' }}>
              <option value="">Todas las materias</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            <select value={orden} onChange={e => setOrden(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none' }}>
              <option value="fecha_desc">Más recientes</option>
              <option value="fecha_asc">Más antiguos</option>
              <option value="puntaje_desc">Mejor puntuados</option>
              <option value="puntaje_asc">Peor puntuados</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', fontSize: '1.2rem', padding: '60px 0' }}>
            <div style={{
              display: 'inline-block', width: '40px', height: '40px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white', borderRadius: '50%',
              animation: 'spin 1s linear infinite', marginBottom: '16px'
            }} />
            <br />Cargando resúmenes...
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : resumenes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>No hay resúmenes todavía.</p>
            <p style={{ fontSize: '1rem', color: '#ccc', marginTop: '8px' }}>¡Subí el primero!</p>
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
