import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logoImage from '../assets/img/logoatr.png';
import { api, isAuthenticated } from '../api';

const ForoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foro, setForo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const autenticado = isAuthenticated();

  const API_BASE = 'http://localhost:8080/api/v1';

  const cargarForo = useCallback(() => {
    fetch(`${API_BASE}/foros/${id}`).then(r => r.ok ? r.json() : null).then(d => { if (d) setForo(d); }).catch(() => navigate('/foro'));
  }, [id, navigate]);

  const cargarComentarios = useCallback(() => {
    fetch(`${API_BASE}/foros/${id}/comentarios`).then(r => r.ok ? r.json() : []).then(setComentarios).catch(() => {});
  }, [id]);

  useEffect(() => { cargarForo(); cargarComentarios(); }, [cargarForo, cargarComentarios]);

  const handleComentar = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setError('');
    try {
      const response = await api(`/foros/${id}/comentarios`, {
        method: 'POST',
        body: JSON.stringify({ contenido: nuevoComentario }),
      });
      if (response.ok) {
        setNuevoComentario('');
        cargarComentarios();
      } else {
        const err = await response.json();
        setError(err.message || 'Error al comentar');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const handleCerrar = async () => {
    if (!window.confirm('¿Cerrar este hilo? Ya no se podrá comentar.')) return;
    await api(`/foros/${id}/cerrar`, { method: 'PUT' });
    cargarForo();
  };

  const handleEliminarHilo = async () => {
    if (!window.confirm('¿Eliminar este hilo?')) return;
    await api(`/foros/${id}`, { method: 'DELETE' });
    navigate('/foro');
  };

  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;
    await api(`/foros/comentarios/${comentarioId}`, { method: 'DELETE' });
    cargarComentarios();
  };

  if (!foro) return <div style={{ color: 'white', padding: '20px' }}>Cargando...</div>;

  const esPropio = user.id === foro.usuarioId;

  return (
    <div style={{
      backgroundImage: `url(${require('../assets/img/libros.jpg')})`,
      backgroundSize: 'cover',
      minHeight: '100vh', color: 'white', fontFamily: 'Open Sans, sans-serif'
    }}>
      <div style={{
        width: '100%', backgroundColor: 'rgba(117, 28, 28)', padding: '20px',
        position: 'fixed', top: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <img src={logoImage} alt="Logo" style={{ width: '200px', marginLeft: '10px' }} />
        <button onClick={() => navigate('/foro')}
          style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '10px', transition: 'background 0.15s' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      <div style={{ padding: '120px 10% 50px' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '25px', color: 'black', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{foro.titulo}</h2>
            {esPropio && foro.estado === 'ACTIVO' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleCerrar}
                  style={{ padding: '8px 16px', backgroundColor: '#856404', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  Cerrar
                </button>
                <button onClick={handleEliminarHilo}
                  style={{ padding: '8px 16px', backgroundColor: '#a00', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  Eliminar
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', margin: '10px 0', fontSize: '0.9em', color: '#666' }}>
            {foro.materiaNombre && (
              <span style={{ backgroundColor: '#4a1010', color: 'white', padding: '2px 10px', borderRadius: '12px' }}>
                {foro.materiaNombre}
              </span>
            )}
            <span>Por {foro.usuarioNombre}</span>
            <span>&middot; {new Date(foro.createdAt).toLocaleDateString()}</span>
            {foro.estado === 'CERRADO' && <span style={{ color: '#856404' }}>&middot; Cerrado</span>}
          </div>

          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{foro.contenido}</p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '25px', color: 'black' }}>
          <h3 style={{ marginTop: 0 }}>Comentarios ({comentarios.length})</h3>

          {comentarios.length === 0 && <p style={{ color: '#666' }}>Sin comentarios aún. ¡Sé el primero!</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {comentarios.map(c => (
              <div key={c.id} style={{
                backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '5px' }}>
                    <strong>{c.usuarioNombre}</strong> &middot; {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                  {user.id === c.usuarioId && (
                    <button onClick={() => handleEliminarComentario(c.id)}
                      style={{ background: 'none', border: 'none', color: '#a00', cursor: 'pointer', fontSize: '0.9em' }}>
                      Eliminar
                    </button>
                  )}
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{c.contenido}</p>
              </div>
            ))}
          </div>

          {foro.estado === 'ACTIVO' ? (
            !autenticado ? (
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ color: '#666', marginBottom: '12px' }}>Iniciá sesión para comentar</p>
                <button onClick={() => navigate('/login')}
                  style={{ padding: '10px 20px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Iniciar sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleComentar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea placeholder="Escribí tu comentario..." value={nuevoComentario}
                  onChange={e => setNuevoComentario(e.target.value)} required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }} />
                {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
                <button type="submit"
                  style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                  Comentar
                </button>
              </form>
            )
          ) : (
            <p style={{ color: '#856404', fontStyle: 'italic' }}>Este hilo está cerrado. No se pueden agregar más comentarios.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForoDetalle;
