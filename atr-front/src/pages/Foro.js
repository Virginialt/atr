import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import Header from '../components/Header';
import { api, isAuthenticated, API_BASE } from '../api';

const Foro = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [materiaFiltro, setMateriaFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/materia`).then(r => r.json()).then(setMaterias).catch(() => {});
  }, [navigate]);

  const cargarForos = useCallback(() => {
    const params = new URLSearchParams();
    if (materiaFiltro) params.append('materiaId', materiaFiltro);
    if (busqueda) params.append('buscar', busqueda);
    fetch(`${API_BASE}/foros${params.toString() ? '?' + params.toString() : ''}`)
      .then(r => r.ok ? r.json() : []).then(setForos).catch(() => setForos([]));
  }, [materiaFiltro, busqueda]);

  useEffect(() => { cargarForos(); }, [cargarForos]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api('/foros', {
        method: 'POST',
        body: JSON.stringify({
          titulo,
          contenido,
          materiaId: materiaId || null,
        }),
      });
      if (response.ok) {
        setMostrarCrear(false);
        setTitulo('');
        setContenido('');
        setMateriaId('');
        cargarForos();
      } else {
        setError('Error al crear el hilo');
      }
    } catch {
      setError('Error de conexión');
    }
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
            + Nuevo hilo
          </button>
        )}

        {mostrarCrear && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Nuevo hilo</h3>
            <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required className="input" />
              <textarea placeholder="Contenido" value={contenido} onChange={e => setContenido(e.target.value)} required className="input" style={{ minHeight: '100px' }} />
              <select value={materiaId} onChange={e => setMateriaId(e.target.value)} className="input">
                <option value="">General (sin materia)</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
              {error && <p className="error-text">{error}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">Publicar</button>
                <button type="button" onClick={() => { setMostrarCrear(false); setError(''); }} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="filter-bar">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar hilos..." value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ width: '280px' }} />
            <select value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)}>
              <option value="">Todas las materias</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {foros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <p className="empty-state-title">No hay hilos aún. ¡Creá el primero!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {foros.map((hilo, idx) => (
              <div key={hilo.id} onClick={() => navigate(`/foro/${hilo.id}`)}
                className="card card-hover"
                style={{ cursor: 'pointer', animation: `slideUp 0.3s ease ${idx * 0.04}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{hilo.titulo}</h3>
                  <span style={{ fontSize: '0.85em', color: '#666' }}>
                    {hilo.cantidadComentarios} comentario{hilo.cantidadComentarios !== 1 ? 's' : ''}
                  </span>
                </div>
                <p style={{ margin: '8px 0', fontSize: '0.9em', color: '#444' }}>
                  {hilo.contenido.length > 200 ? hilo.contenido.substring(0, 200) + '...' : hilo.contenido}
                </p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.85em', color: '#666' }}>
                  {hilo.materiaNombre && <span className="tag">{hilo.materiaNombre}</span>}
                  <span>Por {hilo.usuarioNombre}</span>
                  <span>&middot; {new Date(hilo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Foro;
