import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import Header from '../components/Header';
import { api, isAuthenticated, API_BASE } from '../api';

const GrupoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState(null);
  const autenticado = isAuthenticated();
  const [mostrarEncuentro, setMostrarEncuentro] = useState(false);
  const [eTitulo, setETitulo] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [eUbicacion, setEUbicacion] = useState('');
  const [eFecha, setEFecha] = useState('');
  const [eHora, setEHora] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const cargar = useCallback(() => {
    fetch(`${API_BASE}/grupos/${id}`).then(r => r.ok ? r.json() : null).then(d => { if (d) setGrupo(d); }).catch(() => navigate('/grupos'));
  }, [id, navigate]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleUnirse = async () => {
    try {
      const r = await api(`/grupos/${id}/unirse`, { method: 'POST' });
      if (r.ok) cargar();
      else { const e = await r.json(); setError(e.message || 'Error'); }
    } catch { setError('Error de conexión'); }
  };

  const handleSalir = async () => {
    try {
      const r = await api(`/grupos/${id}/salir`, { method: 'POST' });
      if (r.ok) cargar();
    } catch { setError('Error de conexión'); }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar este grupo?')) return;
    await api(`/grupos/${id}`, { method: 'DELETE' });
    navigate('/grupos');
  };

  const handleCrearEncuentro = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fechaHora = new Date(`${eFecha}T${eHora}`).toISOString();
      const r = await api(`/grupos/${id}/encuentros`, {
        method: 'POST',
        body: JSON.stringify({ titulo: eTitulo, descripcion: eDesc, ubicacion: eUbicacion, fechaHora }),
      });
      if (r.ok) {
        setMostrarEncuentro(false);
        setETitulo(''); setEDesc(''); setEUbicacion(''); setEFecha(''); setEHora('');
        cargar();
      } else {
        setError('Error al crear encuentro');
      }
    } catch { setError('Error de conexión'); }
  };

  const handleEliminarEncuentro = async (encId) => {
    if (!window.confirm('¿Eliminar este encuentro?')) return;
    await api(`/grupos/encuentros/${encId}`, { method: 'DELETE' });
    cargar();
  };

  if (!grupo) return <div style={{ color: 'white', padding: '20px' }}>Cargando...</div>;

  const esCreador = user.id === grupo.creadorId;

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      minHeight: '100vh', color: 'white', fontFamily: 'Open Sans, sans-serif'
    }}>
      <Header />

      <div style={{ padding: '95px 8% 50px', animation: 'fadeIn 0.3s ease' }}>
        {error && <p className="error-text" style={{ marginBottom: '12px' }}>{error}</p>}

        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0 }}>{grupo.nombre}</h2>
              {grupo.materiaNombre && <span className="tag" style={{ marginTop: '8px' }}>{grupo.materiaNombre}</span>}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0, marginLeft: '16px' }}>
              {!grupo.esMiembro ? (
                  <button onClick={() => { if (autenticado) { handleUnirse(); } else { navigate('/login'); } }}
                    className="btn">Unirse</button>
                ) : (
                  <>
                    {!esCreador && <button onClick={handleSalir} className="btn btn-sm btn-warning">Salir</button>}
                    {esCreador && <button onClick={handleEliminar} className="btn btn-sm btn-danger">Eliminar grupo</button>}
                </>
              )}
            </div>
          </div>

          {grupo.descripcion && <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{grupo.descripcion}</p>}

          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
            Creado por {grupo.creadorNombre} &middot; {grupo.cantidadMiembros} miembro{grupo.cantidadMiembros !== 1 ? 's' : ''}
            {grupo.maxIntegrantes ? ` (máx: ${grupo.maxIntegrantes})` : ''}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Miembros</h3>
            {(!grupo.miembros || grupo.miembros.length === 0) ? (
              <p style={{ color: '#666' }}>Sin miembros</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {grupo.miembros.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span>{m.usuarioNombre}{m.usuarioId === grupo.creadorId ? ' 👑' : ''}</span>
                    <span style={{ fontSize: '0.85em', color: '#666' }}>{new Date(m.fechaUnion).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Encuentros</h3>
              {grupo.esMiembro && !mostrarEncuentro && (
                  <button onClick={() => setMostrarEncuentro(true)} className="btn btn-sm">+ Nuevo</button>
              )}
            </div>

            {mostrarEncuentro && (
              <form onSubmit={handleCrearEncuentro} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <input type="text" placeholder="Título" value={eTitulo} onChange={e => setETitulo(e.target.value)} required className="input" />
                <input type="text" placeholder="Ubicación (ej: Biblioteca 2do piso)" value={eUbicacion} onChange={e => setEUbicacion(e.target.value)} className="input" />
                <textarea placeholder="Descripción" value={eDesc} onChange={e => setEDesc(e.target.value)} className="input" style={{ minHeight: '50px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" value={eFecha} onChange={e => setEFecha(e.target.value)} required className="input" style={{ flex: 1 }} />
                  <input type="time" value={eHora} onChange={e => setEHora(e.target.value)} required className="input" style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn">Crear</button>
                    <button type="button" onClick={() => setMostrarEncuentro(false)} className="btn btn-secondary">Cancelar</button>
                </div>
              </form>
            )}

            {(!grupo.encuentros || grupo.encuentros.length === 0) ? (
              <p style={{ color: '#666' }}>No hay encuentros programados</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {grupo.encuentros.map(e => (
                  <div key={e.id} className="card-flat">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{e.titulo}</strong>
                      {user.id === e.creadorId && (
                        <button onClick={() => handleEliminarEncuentro(e.id)}
                          style={{ background: 'none', border: 'none', color: '#a00', cursor: 'pointer', fontSize: '0.9em' }}>
                          Eliminar
                        </button>
                      )}
                    </div>
                    {e.descripcion && <p style={{ margin: '5px 0', fontSize: '0.9em' }}>{e.descripcion}</p>}
                    {e.ubicacion && <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#4a1010' }}>📍 {e.ubicacion}</p>}
                    <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
                      🗓 {new Date(e.fechaHora).toLocaleDateString()} a las {new Date(e.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      &middot; Por {e.creadorNombre}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrupoDetalle;
