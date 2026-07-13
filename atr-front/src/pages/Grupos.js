import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import Header from '../components/Header';
import { api, isAuthenticated, API_BASE } from '../api';

const Grupos = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [materiaFiltro, setMateriaFiltro] = useState('');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [maxIntegrantes, setMaxIntegrantes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/materia`).then(r => r.json()).then(setMaterias).catch(() => {});
  }, [navigate]);

  const cargarGrupos = useCallback(() => {
    const params = materiaFiltro ? `?materiaId=${materiaFiltro}` : '';
    fetch(`${API_BASE}/grupos${params}`).then(r => r.ok ? r.json() : []).then(setGrupos).catch(() => setGrupos([]));
  }, [materiaFiltro]);

  useEffect(() => { cargarGrupos(); }, [cargarGrupos]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api('/grupos', {
        method: 'POST',
        body: JSON.stringify({
          nombre,
          descripcion,
          materiaId: materiaId || null,
          maxIntegrantes: maxIntegrantes ? parseInt(maxIntegrantes) : null,
        }),
      });
      if (response.ok) {
        setMostrarCrear(false);
        setNombre(''); setDescripcion(''); setMateriaId(''); setMaxIntegrantes('');
        cargarGrupos();
      } else {
        setError('Error al crear el grupo');
      }
    } catch { setError('Error de conexión'); }
  };

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
      minHeight: '100vh', color: 'white',       fontFamily: 'Open Sans, sans-serif'
    }}>
      <Header />

      <div style={{ padding: '95px 5% 50px', animation: 'fadeIn 0.3s ease' }}>
        {!mostrarCrear && (
          <button onClick={() => { if (isAuthenticated()) { setMostrarCrear(true); } else { navigate('/login'); } }}
            className="btn btn-lg" style={{ marginBottom: '20px' }}>
            + Crear grupo
          </button>
        )}

        {mostrarCrear && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Nuevo grupo de estudio</h3>
            <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Nombre del grupo" value={nombre} onChange={e => setNombre(e.target.value)} required className="input" />
              <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="input" style={{ minHeight: '60px' }} />
              <select value={materiaId} onChange={e => setMateriaId(e.target.value)} className="input">
                <option value="">General (sin materia)</option>
                {materias.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
              </select>
              <input type="number" placeholder="Máximo de integrantes (opcional)" min="2" value={maxIntegrantes}
                onChange={e => setMaxIntegrantes(e.target.value)} className="input" />
              {error && <p className="error-text">{error}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">Crear</button>
                <button type="button" onClick={() => { setMostrarCrear(false); setError(''); }} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="filter-bar">
          <select value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)} style={{ width: '300px', maxWidth: '100%' }}>
            <option value="">Todos los grupos</option>
            {materias.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
        </div>

        {grupos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-title">No hay grupos aún. ¡Creá el primero!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {grupos.map((g, idx) => (
              <div key={g.id} onClick={() => navigate(`/grupos/${g.id}`)}
                className="card card-hover"
                style={{ cursor: 'pointer', animation: `slideUp 0.3s ease ${idx * 0.04}s both` }}>
                <h3 style={{ margin: 0 }}>{g.nombre}</h3>
                {g.materiaNombre && <span className="tag" style={{ margin: '8px 0' }}>{g.materiaNombre}</span>}
                {g.descripcion && <p style={{ fontSize: '0.9em', color: '#444', margin: '8px 0' }}>{g.descripcion}</p>}
                <div style={{ fontSize: '0.85em', color: '#666', display: 'flex', gap: '15px' }}>
                  <span>👤 {g.cantidadMiembros}{g.maxIntegrantes ? `/${g.maxIntegrantes}` : ''}</span>
                  <span>Por {g.creadorNombre}</span>
                  {g.esMiembro && <span style={{ color: '#4a1010', fontWeight: 'bold' }}>✓ Miembro</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grupos;
