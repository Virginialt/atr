import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/libros.jpg';
import resumenesImage from '../assets/img/resumenes.png';
import comunidadImage from '../assets/img/comunidad.png';
import logoImage from '../assets/img/logoatr.png';

function Bienvenido() {
  const navigate = useNavigate();

  const handleResumenesClick = () => {
    navigate('/resumenes');
  };

  const handleComunidadClick = () => {
    navigate('/comunidad');
  };

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
            marginTop:'2px',
            position: 'absolute',
            left: '20px',
            width: '250px',
          }}
        />
      </div>

      <h1 style={{ fontSize: '3rem', margin: '0', textAlign: 'center', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)'}}>
        ¡Bienvenido/a de nuevo!
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '50%',
          marginTop: '100px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={resumenesImage} 
            alt="Resúmenes" 
            style={{ width: '150px', marginBottom: '10px' }}
          />
          <button 
            onClick={handleResumenesClick}
            style={{ 
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#4a1010',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem'
            }}
          >
            Resúmenes
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={comunidadImage} 
            alt="Comunidad" 
            style={{ width: '200px', marginBottom: '20px' }}
          />
          <button 
            onClick={handleComunidadClick}
            style={{ 
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#4a1010',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem'
            }}
          >
            Comunidad
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bienvenido;