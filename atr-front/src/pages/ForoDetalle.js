import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';
import { api, isAuthenticated, API_BASE } from '../api';

const ForoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foro, setForo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const autenticado = isAuthenticated();
  const [editandoHilo, setEditandoHilo] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [editComentarioId, setEditComentarioId] = useState(null);
  const [editComentarioTexto, setEditComentarioTexto] = useState('');
  const [confirm, setConfirm] = useState(null);

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

  const handleEditarHilo = () => {
    setEditTitulo(foro.titulo);
    setEditContenido(foro.contenido);
    setEditandoHilo(true);
  };

  const handleGuardarHilo = async (e) => {
    e.preventDefault();
    try {
      const r = await api(`/foros/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ titulo: editTitulo, contenido: editContenido }),
      });
      if (r.ok) {
        setEditandoHilo(false);
        cargarForo();
      }
    } catch {}
  };

  const handleCerrar = async () => {
    setConfirm({
      message: '¿Cerrar este hilo? Ya no se podrá comentar.',
      onConfirm: async () => {
        await api(`/foros/${id}/cerrar`, { method: 'PUT' });
        cargarForo();
      }
    });
  };

  const handleEliminarHilo = async () => {
    setConfirm({
      message: '¿Eliminar este hilo?',
      onConfirm: async () => {
        await api(`/foros/${id}`, { method: 'DELETE' });
        navigate('/foro');
      }
    });
  };

  const handleEditarComentario = (c) => {
    setEditComentarioId(c.id);
    setEditComentarioTexto(c.contenido);
  };

  const handleGuardarComentario = async (comentarioId) => {
    try {
      const r = await api(`/foros/comentarios/${comentarioId}`, {
        method: 'PUT',
        body: JSON.stringify({ contenido: editComentarioTexto }),
      });
      if (r.ok) {
        setEditComentarioId(null);
        setEditComentarioTexto('');
        cargarComentarios();
      }
    } catch {}
  };

  const handleEliminarComentario = (comentarioId) => {
    setConfirm({
      message: '¿Eliminar este comentario?',
      onConfirm: async () => {
        await api(`/foros/comentarios/${comentarioId}`, { method: 'DELETE' });
        cargarComentarios();
      }
    });
  };

  if (!foro) return <div style={{ color: 'white', padding: '20px' }}>Cargando...</div>;

  const esPropio = user.id === foro.usuarioId;

  return (
    <div style={{
      backgroundImage: `url(${require('../assets/img/libros.jpg')})`,
      backgroundSize: 'cover',
      minHeight: '100vh', color: 'white', fontFamily: 'Open Sans, sans-serif'
    }}>
      <Header />

      <div style={{ padding: '95px 8% 50px', animation: 'fadeIn 0.3s ease' }}>
        <div className="card" style={{ marginBottom: '20px' }}>
          {editandoHilo ? (
            <form onSubmit={handleGuardarHilo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} required className="input" />
              <textarea value={editContenido} onChange={e => setEditContenido(e.target.value)} required className="input" style={{ minHeight: '120px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" onClick={() => setEditandoHilo(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{foro.titulo}</h2>
                {esPropio && foro.estado === 'ACTIVO' && (
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0, marginLeft: '16px' }}>
                    <button onClick={handleEditarHilo} className="btn btn-sm">Editar</button>
                    <button onClick={handleCerrar} className="btn btn-sm btn-warning">Cerrar</button>
                    <button onClick={handleEliminarHilo} className="btn btn-sm btn-danger">Eliminar</button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', margin: '10px 0', fontSize: '0.9em', color: '#666' }}>
                {foro.materiaNombre && <span className="tag">{foro.materiaNombre}</span>}
                <span>Por {foro.usuarioNombre}</span>
                <span>&middot; {new Date(foro.createdAt).toLocaleDateString()}</span>
                {foro.estado === 'CERRADO' && <span style={{ color: '#856404' }}>&middot; Cerrado</span>}
              </div>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{foro.contenido}</p>
            </>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Comentarios ({comentarios.length})</h3>

          {comentarios.length === 0 && <p style={{ color: '#666' }}>Sin comentarios aún. ¡Sé el primero!</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {comentarios.map(c => (
              <div key={c.id} className="card-flat">
                {editComentarioId === c.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea value={editComentarioTexto} onChange={e => setEditComentarioTexto(e.target.value)} className="input" style={{ minHeight: '60px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleGuardarComentario(c.id)} className="btn btn-sm">Guardar</button>
                      <button onClick={() => setEditComentarioId(null)} className="btn btn-sm btn-secondary">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '5px' }}>
                        <strong>{c.usuarioNombre}</strong> &middot; {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                      {user.id === c.usuarioId && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditarComentario(c)}
                            style={{ background: 'none', border: 'none', color: '#4a1010', cursor: 'pointer', fontSize: '0.9em' }}>
                            Editar
                          </button>
                          <button onClick={() => handleEliminarComentario(c.id)}
                            style={{ background: 'none', border: 'none', color: '#a00', cursor: 'pointer', fontSize: '0.9em' }}>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{c.contenido}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {foro.estado === 'ACTIVO' ? (
            !autenticado ? (
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ color: '#666', marginBottom: '12px' }}>Iniciá sesión para comentar</p>
                <button onClick={() => navigate('/login')} className="btn">Iniciar sesión</button>
              </div>
            ) : (
              <form onSubmit={handleComentar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea placeholder="Escribí tu comentario..." value={nuevoComentario}
                  onChange={e => setNuevoComentario(e.target.value)} required
                  className="input" style={{ minHeight: '80px' }} />
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="btn" style={{ alignSelf: 'flex-start' }}>Comentar</button>
              </form>
            )
          ) : (
            <p style={{ color: '#856404', fontStyle: 'italic' }}>Este hilo está cerrado. No se pueden agregar más comentarios.</p>
          )}
        </div>
      </div>

      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
    </div>
  );
};

export default ForoDetalle;
