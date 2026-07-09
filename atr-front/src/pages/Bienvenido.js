import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import resumenesImage from '../assets/img/resumenes.png';
import comunidadImage from '../assets/img/comunidad.png';
import foroImage from '../assets/img/foro.png';
import tutoresImage from '../assets/img/tutores.png';
import logoImage from '../assets/img/logoatr.png';
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
      <div style={{
        width: '100%', backgroundColor: 'rgba(117, 28, 28)', padding: '20px',
        position: 'fixed', top: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <img src={logoImage} alt="Logo" style={{ width: '200px', marginLeft: '10px' }} />
        {loggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '10px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>{user.nombre || user.email}</span>
            <button onClick={logout}
              style={{ padding: '8px 18px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')}
            style={{ padding: '10px 24px', backgroundColor: 'white', color: '#751C1C', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginRight: '10px' }}>
            Iniciar sesión
          </button>
        )}
      </div>

      <h1 style={{ fontSize: '2.6rem', margin: '0', textAlign: 'center', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)'}}>
        {loggedIn ? '¡Bienvenido/a de nuevo!' : 'Bienvenido/a a A Todo Resumen'}
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          width: '90%',
          marginTop: '90px',
        }}
      >
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px 24px',
          borderRadius: '12px', backdropFilter: 'blur(4px)',
        }}>
          <img src={resumenesImage} alt="Resúmenes" style={{ width: '130px', marginBottom: '12px' }} />
          <button onClick={() => irA('/resumenes')}
            style={{ padding: '14px 32px', cursor: 'pointer', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold' }}>
            Resúmenes
          </button>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px 24px',
          borderRadius: '12px', backdropFilter: 'blur(4px)',
        }}>
          <img src={foroImage} alt="Foro" style={{ width: '130px', marginBottom: '12px' }} />
          <button onClick={() => irA('/foro')}
            style={{ padding: '14px 32px', cursor: 'pointer', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold' }}>
            Foro
          </button>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px 24px',
          borderRadius: '12px', backdropFilter: 'blur(4px)',
        }}>
          <img src={comunidadImage} alt="Grupos de Estudio" style={{ width: '130px', marginBottom: '12px' }} />
          <button onClick={() => irA('/grupos')}
            style={{ padding: '14px 32px', cursor: 'pointer', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold' }}>
            Grupos de Estudio
          </button>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px 24px',
          borderRadius: '12px', backdropFilter: 'blur(4px)',
        }}>
          <img src={tutoresImage} alt="Tutores" style={{ width: '130px', marginBottom: '12px' }} />
          <button onClick={() => irA('/mensajes')}
            style={{ padding: '14px 32px', cursor: 'pointer', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold' }}>
            Tutores
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bienvenido;
