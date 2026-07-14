import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { api, isAuthenticated, API_BASE } from '../api';
import bgImage from '../assets/img/libros.jpg';

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

const Mensajes = () => {
  const navigate = useNavigate();
  const { contactoId } = useParams();
  const autenticado = isAuthenticated();
  const [tutores, setTutores] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [chatUsuario, setChatUsuario] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const chatEndRef = useRef(null);
  const msgsRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch(`${API_BASE}/usuario/tutores`)
      .then(r => r.ok ? r.json() : [])
      .then(setTutores)
      .catch(() => {});
  }, []);

  const cargarMensajes = useCallback((id) => {
    if (!autenticado) return;
    api(`/mensajes/conversacion/${id}`).then(r => r.json()).then(data => {
      setMensajes(data);
    }).catch(() => setMensajes([]));
  }, [autenticado]);

  useEffect(() => {
    const id = parseInt(contactoId, 10);
    if (activeChatIdRef.current !== id) {
      activeChatIdRef.current = id;
      cargarMensajes(id);
    }
    const tutor = tutores.find(t => t.id === id);
    if (tutor) {
      setChatUsuario({ id, nombre: `${tutor.nombre} ${tutor.apellido}` });
    }
  }, [contactoId, tutores, cargarMensajes]);

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
      }
    } finally { setEnviando(false); }
  };

  const formatearHora = (fechaStr) => {
    return new Date(fechaStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (nombre) => {
    if (!nombre) return '?';
    return nombre.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
  };

  const colorPara = (id) => COLORS[Math.abs(id) % COLORS.length];

  const agruparPorDia = (msgs) => {
    if (!msgs.length) return [];
    const grupos = [];
    let diaActual = '';
    for (const m of msgs) {
      const d = new Date(m.createdAt).toLocaleDateString();
      if (d !== diaActual) {
        diaActual = d;
        grupos.push({ tipo: 'separador', fecha: d });
      }
      grupos.push(m);
    }
    return grupos;
  };

  const formatearSeparador = (fecha) => {
    const hoy = new Date().toLocaleDateString();
    const ayer = new Date(Date.now() - 86400000).toLocaleDateString();
    if (fecha === hoy) return 'Hoy';
    if (fecha === ayer) return 'Ayer';
    return fecha;
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: 'Open Sans, sans-serif', paddingTop: '56px', boxSizing: 'border-box',
    }}>
      <Header />

      <div style={{
        flex: 1, display: 'flex', overflow: 'hidden',
        backgroundImage: `url(${bgImage})`, backgroundSize: 'cover',
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.75)',
          maxWidth: '900px', margin: '0 auto',
          boxShadow: '0 0 30px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            padding: '14px 20px', backgroundColor: 'white',
            borderBottom: '1.5px solid #751C1C',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <button onClick={() => navigate('/tutores')}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#751C1C', padding: '4px 8px 4px 0', flexShrink: 0 }}>
              ←
            </button>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: chatUsuario ? colorPara(chatUsuario.id) : '#555',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '14px', flexShrink: 0,
            }}>
              {chatUsuario ? getInitials(chatUsuario.nombre) : '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a2e' }}>{chatUsuario ? chatUsuario.nombre : 'Cargando...'}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {mensajes.length > 0 ? `${mensajes.length} mensajes` : 'sin mensajes'}
              </div>
            </div>
          </div>

          <div ref={msgsRef} style={{
            flex: 1, overflowY: 'auto', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            {!chatUsuario ? (
              <div className="spinner" style={{ margin: '60px auto' }} />
            ) : mensajes.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', marginTop: '60px', padding: '20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>💬</div>
                <p style={{ fontSize: '15px', margin: 0 }}>No hay mensajes aún.</p>
                <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Escribí algo para iniciar la conversación.</p>
              </div>
            ) : (
              agruparPorDia(mensajes).map((item, idx) => {
                if (item.tipo === 'separador') {
                  return (
                    <div key={`sep-${idx}`} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      margin: '16px 0 8px',
                    }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
                      <span style={{
                        fontSize: '12px', color: '#999', fontWeight: 600,
                        padding: '3px 12px', background: 'rgba(0,0,0,0.03)',
                        borderRadius: '10px', whiteSpace: 'nowrap',
                      }}>
                        {formatearSeparador(item.fecha)}
                      </span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
                    </div>
                  );
                }
                const esMio = item.remitenteId === user.id;
                return (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: esMio ? 'flex-end' : 'flex-start',
                    marginBottom: '4px',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: esMio ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        padding: '10px 16px',
                        borderRadius: esMio ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: esMio ? 'linear-gradient(135deg, #751C1C, #8a2222)' : 'white',
                        color: esMio ? 'white' : '#1a1a2e',
                        fontSize: '14px', lineHeight: '1.5',
                        boxShadow: esMio ? '0 2px 8px rgba(117,28,28,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                      }}>
                        <p style={{ margin: 0, wordBreak: 'break-word' }}>{item.contenido}</p>
                      </div>
                      <span style={{
                        fontSize: '11px', color: '#aaa', marginTop: '2px',
                        padding: '0 4px',
                      }}>
                        {formatearHora(item.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {autenticado ? (
            <form onSubmit={handleEnviar} style={{
              padding: '16px 20px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95), white)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex', gap: '10px', alignItems: 'center',
            }}>
              <input
                type="text" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)}
                placeholder="Escribí un mensaje..."
                style={{
                  flex: 1, padding: '12px 18px',
                  border: '1.5px solid #e0e0e0', borderRadius: '24px',
                  outline: 'none', fontSize: '15px', transition: 'border-color 0.2s, box-shadow 0.2s',
                  backgroundColor: '#f8f8f8',
                }}
                onFocus={e => { e.target.style.borderColor = '#751C1C'; e.target.style.boxShadow = '0 0 0 3px rgba(117,28,28,0.1)'; e.target.style.backgroundColor = 'white'; }}
                onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8f8f8'; }} />
              <button type="submit" disabled={enviando || !nuevoMensaje.trim()}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                  background: (enviando || !nuevoMensaje.trim()) ? '#d0d0d0' : 'linear-gradient(135deg, #751C1C, #8a2222)',
                  color: 'white', cursor: (enviando || !nuevoMensaje.trim()) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0, boxShadow: (enviando || !nuevoMensaje.trim()) ? 'none' : '0 2px 8px rgba(117,28,28,0.3)',
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          ) : (
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <button onClick={() => navigate('/login')} className="btn">
                Iniciá sesión para responder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
