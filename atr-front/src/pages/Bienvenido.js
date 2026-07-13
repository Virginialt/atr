import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import resumenesImage from '../assets/img/resumenes.png';
import comunidadImage from '../assets/img/comunidad.png';
import foroImage from '../assets/img/foro.png';
import tutoresImage from '../assets/img/tutores.png';
import Header from '../components/Header';
import { isAuthenticated, logout } from '../api';

function Bienvenido() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const irA = (ruta) => { navigate(ruta); };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        fontFamily: 'Open Sans, sans-serif',
      }}
    >
      <Header
        rightContent={loggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>{user.nombre || user.email}</span>
            <button onClick={() => navigate('/perfil')} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)' }}>
              Perfil
            </button>
            <button onClick={logout} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="header-btn-white">
            Iniciar sesión
          </button>
        )}
      />

      <h1 style={{ fontSize: '2.6rem', margin: 0, textAlign: 'center', textShadow: '0 4px 12px rgba(0,0,0,0.4)', animation: 'slideUp 0.4s ease' }}>
        {loggedIn ? '¡Bienvenido/a de nuevo!' : 'Bienvenido/a a A Todo Resumen'}
      </h1>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: '30px',
        width: '90%', marginTop: '90px',
        flexWrap: 'wrap',
      }}>
        {[
          { img: resumenesImage, label: 'Resúmenes', route: '/resumenes' },
          { img: foroImage, label: 'Foro', route: '/foro' },
          { img: comunidadImage, label: 'Grupos de Estudio', route: '/grupos' },
          { img: tutoresImage, label: 'Tutores', route: '/mensajes' },
        ].map((item, i) => (
          <div key={item.route}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px 24px',
              borderRadius: '12px', backdropFilter: 'blur(4px)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              cursor: 'pointer', animation: `slideUp 0.4s ease ${i * 0.08}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            onClick={() => irA(item.route)}
          >
            <img src={item.img} alt={item.label} style={{ width: '130px', marginBottom: '12px' }} />
            <div className="btn btn-lg" style={{ pointerEvents: 'none' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bienvenido;
