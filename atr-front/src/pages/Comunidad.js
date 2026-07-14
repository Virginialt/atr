import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { isAuthenticated, API_BASE } from '../api';
import bgImage from '../assets/img/libros.jpg';

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

const Comunidad = () => {
  const navigate = useNavigate();
  const autenticado = isAuthenticated();
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState('');
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/usuario/tutores`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setTutors(data.map(t => ({ ...t, fullName: `${t.nombre} ${t.apellido}` })));
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const filtrados = tutors.filter(t =>
    !search || t.fullName.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const colorIdx = (i) => COLORS[i % COLORS.length];

  const initials = (name) =>
    name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);

  const abrirChat = (id) => {
    if (!autenticado) { navigate('/login'); return; }
    navigate(`/mensajes/${id}`);
  };

  const content = (
    <>
      <div style={{
        padding: '90px 5% 0', position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #751C1C, #a82a2a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0,
            }}>🎓</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Tutores</h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {tutors.length} tutor{tutors.length !== 1 && 'es'} disponible{tutors.length !== 1 && 's'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', padding: '20px 0', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '15px' }}>🔍</span>
              <input
                type="text" placeholder="Buscá por nombre o email..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ width: '100%', padding: '13px 14px 13px 42px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 5% 60px', position: 'relative', zIndex: 1 }}>
        {filtrados.length === 0 ? (
          <div className="empty-state" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🔍</div>
            <p>
              {search ? 'No encontramos tutores con ese nombre.' : 'Todavía no hay tutores registrados.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filtrados.map((t, i) => (
                <div
                  key={t.id}
                  onClick={() => abrirChat(t.id)}
                  className="card"
                  style={{
                    padding: '20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    animation: 'fadeIn 0.35s ease',
                    animationDelay: `${i * 0.04}s`,
                    borderRadius: '16px', border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '14px',
                    background: colorIdx(i), color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '17px', flexShrink: 0,
                  }}>
                    {initials(t.fullName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a2e' }}>{t.fullName}</div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                      {t.email}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', color: '#751C1C', flexShrink: 0 }}>💬</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );

  return cargando ? (
    <div style={{ minHeight: '100vh', background: '#f4f4f9', fontFamily: 'Open Sans, sans-serif' }}>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <div className="spinner" />
      </div>
    </div>
  ) : (
    <div style={{
      backgroundImage: `url(${bgImage})`, backgroundSize: 'cover',
      minHeight: '100vh', color: 'white',
      fontFamily: 'Open Sans, sans-serif'
    }}>
      <Header />
      {content}
    </div>
  );
};

export default Comunidad;
