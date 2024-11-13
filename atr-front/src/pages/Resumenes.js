import React from 'react';
import logoImage from '../assets/img/logoatr.png';
import backgroundImage from '../assets/img/libros.jpg';

const Resumenes = () => {
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
        fontFamily: 'Comic Sans MS',
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
          }}
        />
      </div>
      <div style={{ marginTop: '100px' }}>
        <h1>Página de Resúmenes</h1>
        {/* Aquí puedes agregar el contenido específico de la página de resúmenes */}
      </div>
    </div>
  );
};

export default Resumenes;