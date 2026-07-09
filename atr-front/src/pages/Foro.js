import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/img/logoatr.png';
import backgroundImage from '../assets/img/libros.jpg';
import { api, isAuthenticated } from '../api';

const API_BASE = 'http://localhost:8080/api/v1';

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
            + Nuevo hilo
          </button>
        )}

        {mostrarCrear && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', color: 'black' }}>
            <h3 style={{ marginTop: 0 }}>Nuevo hilo</h3>
            <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <textarea placeholder="Contenido" value={contenido} onChange={e => setContenido(e.target.value)} required
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }} />
              <select value={materiaId} onChange={e => setMateriaId(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="">General (sin materia)</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
              {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit"
                  style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Publicar
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
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <input type="text" placeholder="Buscar hilos..." value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '300px' }} />
            <select value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none' }}>
              <option value="">Todas las materias</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {foros.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>No hay hilos aún. ¡Creá el primero!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {foros.map(hilo => (
              <div key={hilo.id} onClick={() => navigate(`/foro/${hilo.id}`)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '20px',
                  color: 'black', cursor: 'pointer', transition: 'transform 0.1s'
                }}>
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
                  {hilo.materiaNombre && (
                    <span style={{ backgroundColor: '#4a1010', color: 'white', padding: '2px 10px', borderRadius: '12px' }}>
                      {hilo.materiaNombre}
                    </span>
                  )}
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
