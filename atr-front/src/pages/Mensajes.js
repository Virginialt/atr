import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { api, isAuthenticated, API_BASE } from '../api';

const Mensajes = () => {
  const navigate = useNavigate();
  const { contactoId } = useParams();
  const autenticado = isAuthenticated();
  const [contactos, setContactos] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [chatUsuario, setChatUsuario] = useState(null);
  const [mostrarTutores, setMostrarTutores] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const chatEndRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch(`${API_BASE}/usuario/tutores`)
      .then(r => r.ok ? r.json() : [])
      .then(setTutores)
      .catch(() => {});
    if (autenticado) {
      api('/mensajes/contactos')
        .then(r => r.json())
        .then(setContactos)
        .catch(() => {});
    }
  }, [autenticado]);

  const cargarMensajes = useCallback((id) => {
    if (!autenticado) return;
    api(`/mensajes/conversacion/${id}`).then(r => r.json()).then(data => {
      setMensajes(data);
    }).catch(() => setMensajes([]));
  }, [autenticado]);

  useEffect(() => {
    if (!contactoId) {
      setChatUsuario(null);
      setMensajes([]);
      return;
    }
    const id = parseInt(contactoId, 10);
    cargarMensajes(id);
  }, [contactoId, cargarMensajes]);

  useEffect(() => {
    if (!contactoId) return;
    const id = parseInt(contactoId, 10);
    if (activeChatIdRef.current === id) return;
    activeChatIdRef.current = id;
    const contacto = contactos.find(c => c.usuarioId === id);
    if (contacto) {
      setChatUsuario({ id, nombre: contacto.usuarioNombre });
    } else {
      const tutor = tutores.find(t => t.id === id);
      if (tutor) {
        setChatUsuario({ id, nombre: `${tutor.nombre} ${tutor.apellido}` });
      }
    }
  }, [contactoId, contactos, tutores]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [mensajes]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !chatUsuario) return;
    setEnviando(true);
    try {
      const r = await api('/mensajes', {
        method: 'POST',
        body: JSON.stringify({ destinatarioId: chatUsuario.id, contenido: nuevoMensaje }),
      });
      if (r.ok) {
        const msg = await r.json();
        setMensajes(prev => [...prev, msg]);
        setNuevoMensaje('');
        api('/mensajes/contactos').then(res => res.json()).then(setContactos).catch(() => {});
      }
    } finally { setEnviando(false); }
  };

  const iniciarChat = (id, nombre) => {
    if (!autenticado) { navigate('/login'); return; }
    setChatUsuario({ id, nombre });
    setMostrarTutores(false);
    cargarMensajes(id);
    navigate(`/mensajes/${id}`, { replace: true });
  };

  const formatearFecha = (fechaStr) => {
    const d = new Date(fechaStr);
    const ahora = new Date();
    const esHoy = d.toDateString() === ahora.toDateString();
    if (esHoy) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const ayer = new Date(ahora); ayer.setDate(ayer.getDate() - 1);
    if (d.toDateString() === ayer.toDateString()) return 'Ayer';
    return d.toLocaleDateString();
  };

  const formatearFechaCompleta = (fechaStr) => {
    const d = new Date(fechaStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (nombre) => {
    if (!nombre) return '?';
    return nombre.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Open Sans, sans-serif', paddingTop: '56px', boxSizing: 'border-box', backgroundColor: '#f0f0f0' }}>
      <Header />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', maxWidth: '1200px', width: '100%', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '340px', backgroundColor: 'white', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: '0 0 12px', color: '#1a1a2e', fontSize: '1.1rem' }}>Mensajes</h3>
            {autenticado ? (
              <button onClick={() => { setMostrarTutores(!mostrarTutores); }}
                className="btn btn-sm" style={{ width: '100%' }}>
                {mostrarTutores ? 'Cerrar tutores' : '+ Contactar un tutor'}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-sm" style={{ width: '100%' }}>
                Iniciá sesión para chatear
              </button>
            )}
          </div>

          {mostrarTutores && (
            <div style={{ borderBottom: '1px solid #e0e0e0', maxHeight: '240px', overflowY: 'auto' }}>
              <div style={{ padding: '10px 16px', backgroundColor: '#fcf4f4', borderBottom: '1px solid #f0e0e0', fontWeight: 'bold', fontSize: '13px', color: '#751C1C' }}>Tutores disponibles</div>
              {tutores.length === 0 ? (
                <p style={{ padding: '16px', fontSize: '13px', color: '#888', textAlign: 'center' }}>No hay tutores disponibles</p>
              ) : (
                tutores.map(t => (
                  <div key={t.id} onClick={() => iniciarChat(t.id, `${t.nombre} ${t.apellido}`)}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#751C1C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', flexShrink: 0 }}>
                      {getInitials(`${t.nombre} ${t.apellido}`)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{t.nombre} {t.apellido}</div>
                      <div style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.email}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {autenticado ? (
              contactos.length === 0 ? (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                  No tenés conversaciones aún.
                  <br />Hacé clic en "Contactar un tutor" para empezar.
                </div>
              ) : (
                contactos.map(c => {
                  const activo = chatUsuario?.id === c.usuarioId;
                  return (
                    <div key={c.usuarioId} onClick={() => iniciarChat(c.usuarioId, c.usuarioNombre)}
                      style={{
                        padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                        backgroundColor: activo ? '#f0e6e6' : 'white',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!activo) e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
                      onMouseLeave={e => { if (!activo) e.currentTarget.style.backgroundColor = 'white'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: activo ? '#751C1C' : '#555', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                          {getInitials(c.usuarioNombre)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: activo ? '700' : '600', fontSize: '14px', color: '#1a1a2e' }}>{c.usuarioNombre}</span>
                            {c.ultimoMensaje && <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatearFecha(c.ultimoMensaje)}</span>}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                            <span style={{ fontSize: '13px', color: c.noLeidos > 0 ? '#1a1a2e' : '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                              {c.ultimoContenido || 'Sin mensajes'}
                            </span>
                            {c.noLeidos > 0 && (
                              <span style={{ backgroundColor: '#751C1C', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 'bold', marginLeft: '6px', flexShrink: 0 }}>
                                {c.noLeidos}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
                <p style={{ marginBottom: '16px' }}>Iniciá sesión para ver tus conversaciones.</p>
                <button onClick={() => navigate('/login')} className="btn">Iniciar sesión</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f7f7f7' }}>
          {!chatUsuario ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.4 }}>💬</div>
                <p style={{ color: '#999', fontSize: '1.1rem' }}>Seleccioná un contacto para empezar a chatear</p>
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: '14px 20px', backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#751C1C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', flexShrink: 0 }}>
                  {getInitials(chatUsuario.nombre)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>{chatUsuario.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>En línea</div>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mensajes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✉️</div>
                    No hay mensajes aún. Escribí el primero.
                  </div>
                ) : (
                  mensajes.map(m => {
                    const esMio = m.remitenteId === user.id;
                    return (
                      <div key={m.id} style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start', marginBottom: '4px' }}>
                        {!esMio && (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#555', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0, marginRight: '8px', marginTop: '4px', alignSelf: 'flex-end' }}>
                            {getInitials(chatUsuario.nombre)}
                          </div>
                        )}
                        <div style={{ maxWidth: '65%' }}>
                          <div style={{
                            padding: '10px 16px', borderRadius: esMio ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            backgroundColor: esMio ? '#751C1C' : 'white',
                            color: esMio ? 'white' : '#1a1a2e',
                            fontSize: '14px', lineHeight: '1.45',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                          }}>
                            <p style={{ margin: 0 }}>{m.contenido}</p>
                          </div>
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '3px', textAlign: esMio ? 'right' : 'left', paddingLeft: esMio ? 0 : '0', paddingRight: esMio ? 0 : '0' }}>
                            {formatearFechaCompleta(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {autenticado ? (
                <form onSubmit={handleEnviar} style={{ padding: '16px 20px', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} placeholder="Escribí un mensaje..."
                    style={{ flex: 1, padding: '12px 18px', border: '1.5px solid #ddd', borderRadius: '24px', outline: 'none', fontSize: '15px', transition: 'border-color 0.15s' }}
                    onFocus={e => e.target.style.borderColor = '#751C1C'}
                    onBlur={e => e.target.style.borderColor = '#ddd'} />
                  <button type="submit" disabled={enviando || !nuevoMensaje.trim()}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                      backgroundColor: (enviando || !nuevoMensaje.trim()) ? '#ccc' : '#751C1C',
                      color: 'white', cursor: (enviando || !nuevoMensaje.trim()) ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s', flexShrink: 0,
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              ) : (
                <div style={{ padding: '16px 20px', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                  <button onClick={() => navigate('/login')} className="btn">
                    Iniciá sesión para responder
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
