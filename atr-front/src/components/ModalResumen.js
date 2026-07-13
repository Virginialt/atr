import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, isAuthenticated, API_BASE } from '../api';

function ModalResumen({ resumen, onCerrar, onValorado }) {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const autenticado = isAuthenticated();
  const esPropio = user.id === resumen.usuarioId;
  const [valoraciones, setValoraciones] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargandoArchivo, setCargandoArchivo] = useState(true);
  const [errorArchivo, setErrorArchivo] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMateriaId, setEditMateriaId] = useState('');
  const [materias, setMaterias] = useState([]);

  const archivoUrl = resumen.archivoUrl
    ? `${API_BASE}/archivos/${resumen.archivoUrl}`
    : null;

  const esImagen = archivoUrl && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(archivoUrl);
  const esPdf = archivoUrl && /\.pdf$/i.test(archivoUrl);
  const esTexto = archivoUrl && /\.txt$/i.test(archivoUrl);

  useEffect(() => {
    api(`/resumenes/${resumen.id}/valoraciones`)
      .then(r => r.json())
      .then(setValoraciones)
      .catch(() => {});
    fetch(`${API_BASE}/materia`).then(r => r.json()).then(setMaterias).catch(() => {});
  }, [resumen.id]);

  useEffect(() => {
    if (archivoUrl && autenticado && !esImagen) {
      const timer = setTimeout(() => setCargandoArchivo(false), 500);
      return () => clearTimeout(timer);
    }
  }, [archivoUrl, autenticado, esImagen]);

  const handleValorar = async () => {
    if (puntuacion === 0) return;
    setEnviando(true);
    try {
      const r = await api(`/resumenes/${resumen.id}/valorar`, {
        method: 'POST',
        body: JSON.stringify({ puntuacion, comentario: comentario.trim() || null }),
      });
      if (r.ok) {
        setPuntuacion(0);
        setComentario('');
        const updated = await api(`/resumenes/${resumen.id}/valoraciones`)
          .then(res => res.json());
        setValoraciones(updated);
        if (onValorado) onValorado();
      }
    } finally { setEnviando(false); }
  };

  const iniciarEdicion = () => {
    setEditTitulo(resumen.titulo);
    setEditDesc(resumen.descripcion || '');
    setEditMateriaId(resumen.materiaId ? String(resumen.materiaId) : '');
    setEditando(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    formData.append('titulo', editTitulo);
    formData.append('descripcion', editDesc);
    if (editMateriaId) formData.append('materiaId', editMateriaId);
    const r = await fetch(`${API_BASE}/resumenes/${resumen.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (r.ok) {
      setEditando(false);
      if (onValorado) onValorado();
      window.location.reload();
    }
  };

  const estrellasUsuario = valoraciones.find(v => v.usuarioId === user.id);

  return (
    <div onClick={onCerrar} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontFamily: 'Open Sans, sans-serif',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '90%', maxWidth: '1200px', height: '85vh',
        backgroundColor: 'white', borderRadius: '12px',
        display: 'flex', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #ddd', backgroundColor: '#fafafa',
          position: 'relative', color: '#333',
        }}>
          <div style={{
            padding: '16px 20px', backgroundColor: '#751C1C', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {editando ? (
              <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={handleGuardar} className="btn btn-sm">Guardar</button>
                <button onClick={() => setEditando(false)} className="btn btn-sm btn-secondary">Cancelar</button>
              </div>
            ) : (
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resumen.titulo}</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {resumen.materiaNombre} &middot; por {resumen.usuarioNombre}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {esPropio && !editando && (
                <button onClick={iniciarEdicion} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)' }}>Editar</button>
              )}
              <button onClick={onCerrar} style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1, padding: '0 4px 0 16px',
              }}>&times;</button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' }}>
            {(() => {
              if (editando) {
                return (
                  <form onSubmit={handleGuardar} style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} required className="input" placeholder="Título" />
                    <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="input" style={{ minHeight: '80px' }} placeholder="Descripción" />
                    <select value={editMateriaId} onChange={e => setEditMateriaId(e.target.value)} className="input">
                      <option value="">Sin materia</option>
                      {materias.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
                    </select>
                  </form>
                );
              }
              if (!archivoUrl) {
                return (
                  <div style={{ color: '#888', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                    <p style={{ fontSize: '1.1rem' }}>Este resumen no tiene archivo adjunto.</p>
                    {resumen.descripcion && <p style={{ fontStyle: 'italic', color: '#666' }}>{resumen.descripcion}</p>}
                  </div>
                );
              }
              if (!autenticado) {
                return (
                  <div style={{ textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Iniciá sesión para ver el contenido completo.</p>
                    <button onClick={() => navigate('/login')} className="btn">Iniciar sesión</button>
                  </div>
                );
              }
              if (cargandoArchivo) {
                return (
                  <div style={{ textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                    <p>Cargando archivo...</p>
                  </div>
                );
              }
              if (errorArchivo) {
                return (
                  <div style={{ textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>No se pudo cargar el archivo.</p>
                    <a href={archivoUrl} target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Descargar archivo</a>
                  </div>
                );
              }
              if (esImagen) {
                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={archivoUrl} alt={resumen.titulo} onLoad={() => setCargandoArchivo(false)}
                      onError={() => { setCargandoArchivo(false); setErrorArchivo(true); }}
                      style={{ maxWidth: '100%', maxHeight: 'calc(100% - 48px)', objectFit: 'contain', borderRadius: '4px' }} />
                    <a href={archivoUrl} target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '12px' }}>Descargar imagen</a>
                  </div>
                );
              }
              if (esPdf) {
                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <iframe src={archivoUrl} title={resumen.titulo} onLoad={() => setCargandoArchivo(false)}
                      style={{ width: '100%', flex: 1, border: 'none', borderRadius: '4px' }} />
                    <a href={archivoUrl} target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '12px', alignSelf: 'center' }}>Descargar PDF</a>
                  </div>
                );
              }
              if (esTexto) {
                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <iframe src={archivoUrl} title={resumen.titulo} onLoad={() => setCargandoArchivo(false)}
                      style={{ width: '100%', flex: 1, border: 'none', borderRadius: '4px', backgroundColor: 'white' }} />
                    <a href={archivoUrl} target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '12px', alignSelf: 'center' }}>Descargar archivo</a>
                  </div>
                );
              }
              return (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📎</div>
                  <p style={{ marginBottom: '16px', color: '#555', fontSize: '1.1rem' }}>Vista previa no disponible.</p>
                  <a href={archivoUrl} target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Descargar archivo</a>
                </div>
              );
            })()}
          </div>
        </div>

        <div style={{
          width: '380px', display: 'flex', flexDirection: 'column',
          backgroundColor: 'white', color: '#333',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #eee',
            fontWeight: 'bold', color: '#1a1a2e', fontSize: '1rem',
          }}>
            Valoraciones y comentarios
            <span style={{ marginLeft: '8px', color: '#888', fontWeight: 'normal', fontSize: '0.85rem' }}>
              ({valoraciones.length})
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {valoraciones.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', fontSize: '0.9rem', marginTop: '30px' }}>
                Aún no hay valoraciones. ¡Sé el primero en opinar!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...valoraciones].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(v => (
                  <div key={v.id} style={{
                    padding: '12px', borderRadius: '8px',
                    backgroundColor: v.usuarioId === user.id ? '#fef0f0' : '#f9f9f9',
                    border: '1px solid #eee',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#a00' }}>{v.usuarioNombre}</strong>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1, 2, 3, 4, 5].map(e => (
                          <span key={e} style={{ fontSize: '0.9rem', color: e <= v.puntuacion ? '#ffc107' : '#ccc' }}>&#9733;</span>
                        ))}
                      </div>
                    </div>
                    {v.comentario && <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#333', lineHeight: 1.4 }}>{v.comentario}</p>}
                    <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '6px' }}>{new Date(v.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!autenticado ? (
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '12px' }}>Iniciá sesión para valorar este resumen</p>
              <button onClick={() => navigate('/login')} className="btn btn-sm">Iniciar sesión</button>
            </div>
          ) : !estrellasUsuario ? (
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>Tu valoración</div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setPuntuacion(v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: '2px', color: v <= puntuacion ? '#ffc107' : '#ddd' }}>&#9733;</button>
                ))}
              </div>
              <textarea placeholder="Dejá un comentario (opcional)..." value={comentario}
                onChange={e => setComentario(e.target.value)} rows={3}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.85rem', resize: 'none', boxSizing: 'border-box', outline: 'none', fontFamily: 'Open Sans, sans-serif' }} />
              <button onClick={handleValorar} disabled={enviando || puntuacion === 0}
                style={{ marginTop: '10px', width: '100%', background: puntuacion === 0 ? '#ccc' : undefined, cursor: puntuacion === 0 ? 'default' : undefined }}
                className={puntuacion === 0 ? '' : 'btn'}>
                {enviando ? 'Enviando...' : 'Valorar'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa', textAlign: 'center', fontSize: '0.85rem', color: '#333' }}>
              Ya valoraste este resumen ({estrellasUsuario.puntuacion}/5)
              {estrellasUsuario.comentario && <p style={{ margin: '6px 0 0', fontSize: '0.8rem', fontStyle: 'italic', color: '#555' }}>"{estrellasUsuario.comentario}"</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalResumen;
