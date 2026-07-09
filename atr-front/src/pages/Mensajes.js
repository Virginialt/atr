import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoImage from '../assets/img/logoatr.png';
import { api, isAuthenticated } from '../api';

const API_BASE = 'http://localhost:8080/api/v1';

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
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Open Sans, sans-serif' }}>
      <div style={{ backgroundColor: '#751C1C', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={logoImage} alt="Logo" style={{ width: '200px' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/bienvenido')}
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', transition: 'background 0.15s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '320px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: 'white' }}>
            <h3 style={{ margin: 0, color: '#751C1C' }}>Mensajes</h3>
            {autenticado && (
              <button onClick={() => { setMostrarTutores(!mostrarTutores); }}
                style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontSize: '14px' }}>
                + Contactar un tutor
              </button>
            )}
            {!autenticado && (
              <button onClick={() => navigate('/login')}
                style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontSize: '14px' }}>
                Iniciá sesión para chatear
              </button>
            )}
          </div>

          {mostrarTutores && (
            <div style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#fff8f8' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#751C1C', fontSize: '14px' }}>Tutores disponibles</h4>
              {tutores.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#888' }}>No hay tutores disponibles</p>
              ) : (
                tutores.map(t => (
                  <div key={t.id} onClick={() => iniciarChat(t.id, `${t.nombre} ${t.apellido}`)}
                    style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#751C1C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {t.nombre?.[0]}{t.apellido?.[0]}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      <strong>{t.nombre} {t.apellido}</strong>
                      <br /><span style={{ fontSize: '12px', color: '#888' }}>{t.email}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {autenticado ? (
              contactos.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No tenés conversaciones aún.
                  <br />Hacé clic en "Contactar un tutor" para empezar.
                </div>
              ) : (
                contactos.map(c => (
                  <div key={c.usuarioId} onClick={() => iniciarChat(c.usuarioId, c.usuarioNombre)}
                    style={{
                      padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #eee',
                      backgroundColor: chatUsuario?.id === c.usuarioId ? '#e8d5d5' : 'white',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px' }}>{c.usuarioNombre}</strong>
                      {c.ultimoMensaje && <span style={{ fontSize: '11px', color: '#999' }}>{formatearFecha(c.ultimoMensaje)}</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {c.ultimoContenido || 'Sin mensajes'}
                      </span>
                      {c.noLeidos > 0 && (
                        <span style={{ backgroundColor: '#751C1C', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', float: 'right', marginTop: '-20px' }}>
                          {c.noLeidos}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                <p style={{ marginBottom: '16px' }}>Iniciá sesión para ver tus conversaciones y chatear con tutores.</p>
                <button onClick={() => navigate('/login')}
                  style={{ padding: '10px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
          {!chatUsuario ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '1.2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💬</div>
                Seleccioná un contacto para empezar a chatear
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: '15px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#333' }}>
                {chatUsuario.nombre}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {mensajes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>
                    No hay mensajes aún. Escribí el primero.
                  </div>
                ) : (
                  mensajes.map(m => {
                    const esMio = m.remitenteId === user.id;
                    return (
                      <div key={m.id} style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                        <div style={{
                          maxWidth: '70%', padding: '10px 16px', borderRadius: '18px',
                          backgroundColor: esMio ? '#751C1C' : '#e0e0e0',
                          color: esMio ? 'white' : 'black', fontSize: '14px', lineHeight: '1.4',
                        }}>
                          <p style={{ margin: 0 }}>{m.contenido}</p>
                          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                            {formatearFecha(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>
              {autenticado ? (
                <form onSubmit={handleEnviar} style={{ padding: '15px 20px', backgroundColor: 'white', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
                  <input type="text" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} placeholder="Escribí un mensaje..."
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid #ccc', borderRadius: '20px', outline: 'none', fontSize: '15px' }} />
                  <button type="submit" disabled={enviando || !nuevoMensaje.trim()}
                    style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', opacity: (enviando || !nuevoMensaje.trim()) ? 0.6 : 1 }}>
                    Enviar
                  </button>
                </form>
              ) : (
                <div style={{ padding: '15px 20px', backgroundColor: 'white', borderTop: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={() => navigate('/login')}
                    style={{ padding: '10px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
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
