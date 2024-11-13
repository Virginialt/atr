// Registro.js
import React from 'react';
import RegistroFormulario from '../components/RegistroFormulario';
import backgroundImage from '../assets/img/libros.jpg';
import logoImage from '../assets/img/logoatr.png';

function Registro() {
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
        color: 'black',
        fontFamily: 'Open Sans',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '0',
          left: '0',
          padding: '30px',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(117, 28, 28)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{
            marginTop: '2px',
            position: 'absolute',
            left: '20px',
            width: '250px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          width: '300px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <RegistroFormulario />
      </div>
    </div>
  );
}

export default Registro;
