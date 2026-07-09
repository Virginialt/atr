import React from 'react';
import RegistroFormulario from '../components/RegistroFormulario';
import backgroundImage from '../assets/img/libros.jpg';
import logoImage from '../assets/img/logoatr.png';
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: '0',
          left: '0',
          padding: '12px 20px',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(117, 28, 28)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: '200px' }}
        />
        <button onClick={() => navigate('/login')}
          style={{ padding: '12px 28px', backgroundColor: 'white', color: '#751C1C', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          Iniciar Sesión
        </button>
      </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            width: '520px',
            maxWidth: '90%',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            marginTop: '100px',
            boxSizing: 'border-box',
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#751C1C', marginTop: 0, marginBottom: '24px', fontSize: '1.6rem' }}>Crear cuenta</h2>
          <RegistroFormulario />
        </div>
    </div>
  );
}

export default Registro;
