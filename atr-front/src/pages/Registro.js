import React from 'react';
import RegistroFormulario from '../components/RegistroFormulario';
import backgroundImage from '../assets/img/libros.jpg';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'black',
        fontFamily: 'Open Sans',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <Header
        rightContent={
          <button onClick={() => navigate('/login')} className="header-btn-white">Iniciar Sesión</button>
        }
      />

      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          width: '520px',
          maxWidth: '92%',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          marginTop: '100px',
          boxSizing: 'border-box',
          animation: 'slideUp 0.35s ease',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#751C1C', marginTop: 0, marginBottom: '24px', fontSize: '1.6rem' }}>Crear cuenta</h2>
        <RegistroFormulario />
      </div>
    </div>
  );
}

export default Registro;
