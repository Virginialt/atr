import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logoImage from '../assets/img/logoatr.png';
import backgroundImage from '../assets/img/libros.jpg';
import { api, isAuthenticated } from '../api';

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

  const API_BASE = 'http://localhost:8080/api/v1';

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
      <div style={{
        width: '100%', backgroundColor: 'rgba(117, 28, 28)', padding: '20px',
        position: 'fixed', top: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <img src={logoImage} alt="Logo" style={{ width: '200px', marginLeft: '10px' }} />
        <button onClick={() => navigate('/grupos')}
          style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '10px', transition: 'background 0.15s' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      <div style={{ padding: '120px 10% 50px' }}>
        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '25px', color: 'black', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0 }}>{grupo.nombre}</h2>
              {grupo.materiaNombre && (
                <span style={{ backgroundColor: '#4a1010', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', marginTop: '8px' }}>
                  {grupo.materiaNombre}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!grupo.esMiembro ? (
                  <button onClick={() => { if (autenticado) { handleUnirse(); } else { navigate('/login'); } }}
                    style={{ padding: '10px 20px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                    Unirse
                  </button>
                ) : (
                  <>
                    {!esCreador && (
                      <button onClick={handleSalir}
                        style={{ padding: '10px 20px', backgroundColor: '#856404', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        Salir
                      </button>
                    )}
                    {esCreador && (
                      <button onClick={handleEliminar}
                        style={{ padding: '10px 20px', backgroundColor: '#a00', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        Eliminar grupo
                      </button>
                    )}
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
          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '25px', color: 'black' }}>
            <h3 style={{ marginTop: 0 }}>Miembros</h3>
            {(!grupo.miembros || grupo.miembros.length === 0) ? (
              <p style={{ color: '#666' }}>Sin miembros</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grupo.miembros.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span>{m.usuarioNombre}{m.usuarioId === grupo.creadorId ? ' 👑' : ''}</span>
                    <span style={{ fontSize: '0.85em', color: '#666' }}>{new Date(m.fechaUnion).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '25px', color: 'black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Encuentros</h3>
              {grupo.esMiembro && !mostrarEncuentro && (
                  <button onClick={() => setMostrarEncuentro(true)}
                    style={{ padding: '8px 16px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Nuevo
                  </button>
              )}
            </div>

            {mostrarEncuentro && (
              <form onSubmit={handleCrearEncuentro} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <input type="text" placeholder="Título" value={eTitulo} onChange={e => setETitulo(e.target.value)} required
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Ubicación (ej: Biblioteca 2do piso)" value={eUbicacion} onChange={e => setEUbicacion(e.target.value)}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <textarea placeholder="Descripción" value={eDesc} onChange={e => setEDesc(e.target.value)}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '50px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" value={eFecha} onChange={e => setEFecha(e.target.value)} required
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
                  <input type="time" value={eHora} onChange={e => setEHora(e.target.value)} required
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit"
                      style={{ padding: '10px 20px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Crear
                    </button>
                    <button type="button" onClick={() => setMostrarEncuentro(false)}
                      style={{ padding: '10px 20px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Cancelar
                    </button>
                </div>
              </form>
            )}

            {(!grupo.encuentros || grupo.encuentros.length === 0) ? (
              <p style={{ color: '#666' }}>No hay encuentros programados</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {grupo.encuentros.map(e => (
                  <div key={e.id} style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
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
