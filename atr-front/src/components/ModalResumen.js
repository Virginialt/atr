import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, isAuthenticated } from '../api';

const API_BASE = 'http://localhost:8080/api/v1';

function ModalResumen({ resumen, onCerrar, onValorado }) {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const autenticado = isAuthenticated();
  const [valoraciones, setValoraciones] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargandoArchivo, setCargandoArchivo] = useState(true);
  const [errorArchivo, setErrorArchivo] = useState(false);

  useEffect(() => {
    api(`/resumenes/${resumen.id}/valoraciones`)
      .then(r => r.json())
      .then(setValoraciones)
      .catch(() => {});
  }, [resumen.id]);

  const archivoUrl = resumen.archivoUrl
    ? `${API_BASE}/archivos/${resumen.archivoUrl}`
    : null;

  const esImagen = archivoUrl && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(archivoUrl);
  const esPdf = archivoUrl && /\.pdf$/i.test(archivoUrl);
  const esTexto = archivoUrl && /\.txt$/i.test(archivoUrl);

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
          position: 'relative',
        }}>
          <div style={{
            padding: '16px 20px', backgroundColor: '#751C1C', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resumen.titulo}</h3>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {resumen.materiaNombre} &middot; por {resumen.usuarioNombre}
              </span>
            </div>
            <button onClick={onCerrar} style={{
              background: 'none', border: 'none', color: 'white',
              fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1, padding: '0 4px 0 16px',
            }}>&times;</button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!archivoUrl && (
              <div style={{ color: '#888', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                <p style={{ fontSize: '1.1rem' }}>Este resumen no tiene archivo adjunto.</p>
                {resumen.descripcion && <p style={{ fontStyle: 'italic', color: '#666' }}>{resumen.descripcion}</p>}
              </div>
            )}

            {archivoUrl && !autenticado && (
              <div style={{ textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Iniciá sesión para ver el contenido completo.</p>
                <button onClick={() => navigate('/login')}
                  style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Iniciar sesión
                </button>
              </div>
            )}

            {archivoUrl && autenticado && cargandoArchivo && (
              <div style={{ textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                <p>Cargando archivo...</p>
              </div>
            )}

            {archivoUrl && autenticado && errorArchivo && (
              <div style={{ textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>No se pudo cargar el archivo.</p>
                <a href={archivoUrl} target="_blank" rel="noreferrer"
                  style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
                  Descargar archivo
                </a>
              </div>
            )}

            {archivoUrl && autenticado && esImagen && !errorArchivo && (
              <img src={archivoUrl} alt={resumen.titulo}
                onLoad={() => setCargandoArchivo(false)}
                onError={() => { setCargandoArchivo(false); setErrorArchivo(true); }}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', display: cargandoArchivo ? 'none' : 'block' }} />
            )}

            {archivoUrl && autenticado && esPdf && !errorArchivo && (
              <embed src={archivoUrl} type="application/pdf"
                style={{ width: '100%', height: '100%', borderRadius: '4px' }} />
            )}

            {archivoUrl && autenticado && esTexto && !errorArchivo && (
              <iframe src={archivoUrl} title={resumen.titulo}
                onLoad={() => setCargandoArchivo(false)}
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px', backgroundColor: 'white' }} />
            )}

            {archivoUrl && autenticado && !esImagen && !esPdf && !esTexto && !errorArchivo && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📎</div>
                <p style={{ marginBottom: '16px', color: '#555', fontSize: '1.1rem' }}>Vista previa no disponible.</p>
                <a href={archivoUrl} target="_blank" rel="noreferrer"
                  style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
                  Descargar archivo
                </a>
              </div>
            )}
          </div>
        </div>

        <div style={{
          width: '380px', display: 'flex', flexDirection: 'column',
          backgroundColor: 'white',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #eee',
            fontWeight: 'bold', color: '#333', fontSize: '1rem',
          }}>
            Valoraciones y comentarios
            <span style={{ marginLeft: '8px', color: '#888', fontWeight: 'normal', fontSize: '0.85rem' }}>
              ({valoraciones.length})
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {valoraciones.length === 0 ? (
              <div style={{ color: '#aaa', textAlign: 'center', fontSize: '0.9rem', marginTop: '30px' }}>
                Aún no hay valoraciones. ¡Sé el primero en opinar!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...valoraciones].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(v => (
                  <div key={v.id} style={{
                    padding: '12px', borderRadius: '8px',
                    backgroundColor: v.usuarioId === user.id ? '#fef3f3' : '#f9f9f9',
                    border: '1px solid #eee',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.85rem' }}>{v.usuarioNombre}</strong>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1, 2, 3, 4, 5].map(e => (
                          <span key={e} style={{
                            fontSize: '0.9rem',
                            color: e <= v.puntuacion ? '#ffc107' : '#ddd',
                          }}>&#9733;</span>
                        ))}
                      </div>
                    </div>
                    {v.comentario && (
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#555', lineHeight: 1.4 }}>
                        {v.comentario}
                      </p>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '6px' }}>
                      {new Date(v.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!autenticado ? (
            <div style={{
              padding: '16px 20px', borderTop: '1px solid #eee',
              backgroundColor: '#fafafa', textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '12px' }}>
                Iniciá sesión para valorar este resumen
              </p>
              <button onClick={() => navigate('/login')}
                style={{ padding: '10px 20px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Iniciar sesión
              </button>
            </div>
          ) : !estrellasUsuario ? (
            <div style={{
              padding: '16px 20px', borderTop: '1px solid #eee',
              backgroundColor: '#fafafa',
            }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
                Tu valoración
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setPuntuacion(v)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '1.5rem', padding: '2px',
                      color: v <= puntuacion ? '#ffc107' : '#ddd',
                    }}>&#9733;</button>
                ))}
              </div>
              <textarea placeholder="Dejá un comentario (opcional)..."
                value={comentario} onChange={e => setComentario(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #ccc',
                  borderRadius: '6px', fontSize: '0.85rem', resize: 'none',
                  boxSizing: 'border-box', outline: 'none', fontFamily: 'Open Sans, sans-serif',
                }} />
              <button onClick={handleValorar} disabled={enviando || puntuacion === 0}
                style={{
                  marginTop: '10px', padding: '10px', width: '100%',
                  backgroundColor: puntuacion === 0 ? '#ccc' : '#4a1010',
                  color: 'white', border: 'none', borderRadius: '6px',
                  cursor: puntuacion === 0 ? 'default' : 'pointer',
                  fontWeight: 'bold', fontSize: '0.9rem',
                }}>
                {enviando ? 'Enviando...' : 'Valorar'}
              </button>
            </div>
          ) : (
            <div style={{
              padding: '16px 20px', borderTop: '1px solid #eee',
              backgroundColor: '#fafafa', textAlign: 'center',
              fontSize: '0.85rem', color: '#888',
            }}>
              Ya valoraste este resumen ({estrellasUsuario.puntuacion}/5)
              {estrellasUsuario.comentario && (
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  "{estrellasUsuario.comentario}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalResumen;
