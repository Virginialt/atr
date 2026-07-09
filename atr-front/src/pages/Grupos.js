import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/img/logoatr.png';
import backgroundImage from '../assets/img/libros.jpg';
import { api, isAuthenticated } from '../api';

const API_BASE = 'http://localhost:8080/api/v1';

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
        {!mostrarCrear && (
          <button onClick={() => { if (isAuthenticated()) { setMostrarCrear(true); } else { navigate('/login'); } }}
            style={{ padding: '14px 28px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '20px' }}>
            + Crear grupo
          </button>
        )}

        {mostrarCrear && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', color: 'black' }}>
            <h3 style={{ marginTop: 0 }}>Nuevo grupo de estudio</h3>
            <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Nombre del grupo" value={nombre} onChange={e => setNombre(e.target.value)} required
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '60px' }} />
              <select value={materiaId} onChange={e => setMateriaId(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="">General (sin materia)</option>
                {materias.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
              </select>
              <input type="number" placeholder="Máximo de integrantes (opcional)" min="2" value={maxIntegrantes}
                onChange={e => setMaxIntegrantes(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit"
                  style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Crear
                </button>
                <button type="button" onClick={() => { setMostrarCrear(false); setError(''); }}
                  style={{ padding: '12px 24px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <select value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '300px' }}>
            <option value="">Todos los grupos</option>
            {materias.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
        </div>

        {grupos.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>No hay grupos aún. ¡Creá el primero!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {grupos.map(g => (
              <div key={g.id} onClick={() => navigate(`/grupos/${g.id}`)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '20px',
                  color: 'black', cursor: 'pointer'
                }}>
                <h3 style={{ margin: 0 }}>{g.nombre}</h3>
                {g.materiaNombre && (
                  <span style={{ backgroundColor: '#4a1010', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '0.8em', display: 'inline-block', margin: '8px 0' }}>
                    {g.materiaNombre}
                  </span>
                )}
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
