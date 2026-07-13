import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api, isAuthenticated, API_BASE } from '../api';

const Perfil = () => {
  const navigate = useNavigate();
  const autenticado = isAuthenticated();
  const [perfil, setPerfil] = useState(null);
  const [resumenes, setResumenes] = useState([]);
  const [foros, setForos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [carreraId, setCarreraId] = useState('');
  const [anio, setAnio] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!autenticado) { navigate('/login'); return; }
    api('/usuario').then(r => r.json()).then(data => {
      setPerfil(data);
      setNombre(data.nombre || '');
      setApellido(data.apellido || '');
      setCarreraId(data.carreraId ? String(data.carreraId) : '');
      setAnio(data.año ? String(data.año) : '');
    }).catch(() => navigate('/login'));
  }, [autenticado, navigate]);

  useEffect(() => {
    if (!user.id) return;
    fetch(`${API_BASE}/resumenes?usuarioId=${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(setResumenes)
      .catch(() => {});
    fetch(`${API_BASE}/foros?usuarioId=${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(setForos)
      .catch(() => {});
    fetch(`${API_BASE}/grupos?usuarioId=${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(setGrupos)
      .catch(() => {});
  }, [user.id]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      const body = { nombre, apellido };
      if (carreraId) body.carreraId = parseInt(carreraId, 10);
      if (anio) body.año = parseInt(anio, 10);
      if (contrasena) body.contraseña = contrasena;
      const r = await api('/usuario', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setMensaje('Perfil actualizado correctamente.');
        setEditando(false);
        setContrasena('');
        const data = await r.json();
        setPerfil(data);
        const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
        sessionStorage.setItem('user', JSON.stringify({ ...stored, nombre: data.nombre, apellido: data.apellido }));
      } else {
        const err = await r.json();
        setError(err.error || 'Error al actualizar el perfil.');
      }
    } catch { setError('Error de conexión.'); }
    finally { setGuardando(false); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Open Sans, sans-serif' }}>
      <Header
        rightContent={
          <button onClick={() => navigate('/')} className="header-btn-white btn-sm">Volver al inicio</button>
        }
      />

      <div className="page-container" style={{ paddingTop: '80px', maxWidth: '900px', margin: '0 auto' }}>
        {perfil && (
          <div className="card" style={{ marginBottom: '24px', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: '#751C1C', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 'bold', flexShrink: 0,
              }}>
                {(perfil.nombre || perfil.email || '?')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 4px' }}>{perfil.nombre || ''} {perfil.apellido || ''}</h2>
                <p style={{ margin: 0, color: '#666' }}>{perfil.email}</p>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                  {perfil.rol?.toLowerCase()}
                  {perfil.año ? ` · ${perfil.año}° año` : ''}
                </p>
              </div>
              {!editando && (
                <button onClick={() => setEditando(true)} className="btn btn-sm">Editar perfil</button>
              )}
            </div>

            {editando && (
              <form onSubmit={handleGuardar}>
                {error && <p className="error-text" style={{ marginBottom: '12px' }}>{error}</p>}
                {mensaje && <p style={{ color: 'green', marginBottom: '12px' }}>{mensaje}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>Nombre</label>
                    <input className="input" value={nombre} onChange={e => setNombre(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>Apellido</label>
                    <input className="input" value={apellido} onChange={e => setApellido(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>Carrera (ID)</label>
                    <input className="input" value={carreraId} onChange={e => setCarreraId(e.target.value)} placeholder="Opcional" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>Año</label>
                    <input className="input" value={anio} onChange={e => setAnio(e.target.value)} placeholder="Opcional" type="number" min="1" max="6" />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>
                    Nueva contraseña <span style={{ color: '#aaa', fontWeight: 'normal' }}>(dejá vacío para mantener la actual)</span>
                  </label>
                  <input className="input" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="••••••••" />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={guardando} className="btn">
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button type="button" onClick={() => { setEditando(false); setContrasena(''); setError(''); }}
                    className="btn btn-secondary">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ textAlign: 'center', animation: 'slideUp 0.3s ease 0.05s both' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📄</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#751C1C' }}>{resumenes.length}</div>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Resúmenes</div>
          </div>
          <div className="card" style={{ textAlign: 'center', animation: 'slideUp 0.3s ease 0.1s both' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>💬</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#751C1C' }}>{foros.length}</div>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Hilos en foro</div>
          </div>
          <div className="card" style={{ textAlign: 'center', animation: 'slideUp 0.3s ease 0.15s both' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>👥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#751C1C' }}>{grupos.length}</div>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Grupos</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ animation: 'slideUp 0.3s ease 0.1s both' }}>
            <h3 style={{ margin: '0 0 12px' }}>Mis resúmenes</h3>
            {resumenes.length === 0 ? (
              <p className="empty-state-title" style={{ margin: '20px 0' }}>No subiste resúmenes aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {resumenes.map(r => (
                  <div key={r.id} className="card-hover" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', borderRadius: '8px', border: '1px solid #eee', cursor: 'pointer',
                  }} onClick={() => navigate('/resumenes')}>
                    <div>
                      <strong>{r.titulo}</strong>
                      <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '8px' }}>{r.materiaNombre}</span>
                    </div>
                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ animation: 'slideUp 0.3s ease 0.15s both' }}>
            <h3 style={{ margin: '0 0 12px' }}>Mis hilos en el foro</h3>
            {foros.length === 0 ? (
              <p className="empty-state-title" style={{ margin: '20px 0' }}>No participaste en el foro aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {foros.map(f => (
                  <div key={f.id} className="card-hover" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', borderRadius: '8px', border: '1px solid #eee', cursor: 'pointer',
                  }} onClick={() => navigate(`/foro/${f.id}`)}>
                    <div>
                      <strong>{f.titulo}</strong>
                      <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '8px' }}>{f.materiaNombre}</span>
                    </div>
                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ animation: 'slideUp 0.3s ease 0.2s both' }}>
            <h3 style={{ margin: '0 0 12px' }}>Mis grupos</h3>
            {grupos.length === 0 ? (
              <p className="empty-state-title" style={{ margin: '20px 0' }}>No te uniste a ningún grupo aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grupos.map(g => (
                  <div key={g.id} className="card-hover" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', borderRadius: '8px', border: '1px solid #eee', cursor: 'pointer',
                  }} onClick={() => navigate(`/grupos/${g.id}`)}>
                    <div>
                      <strong>{g.nombre}</strong>
                      <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '8px' }}>{g.materiaNombre}</span>
                    </div>
                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{g.cantidadMiembros} miembros</span>
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

export default Perfil;
