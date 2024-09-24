import React from 'react';
import backgroundImage from '../assets/ATR-20240904T142512Z-001/libros.jpg'; // Reemplaza con la ruta correcta de tu imagen de fondo
import resumenesImage from '../assets/ATR-20240904T142512Z-001/Captura_de_pantalla_2024-08-28_195926-removebg-preview.png'; // Reemplaza con la imagen para "Resúmenes"
import comunidadImage from '../assets/ATR-20240904T142512Z-001/comunidad.png'; // Reemplaza con la imagen para "Comunidad"
import logoImage from '../assets/ATR-20240904T142512Z-001/logoatr.png'; // Reemplaza con la imagen de tu logo para el encabezado

function Bienvenido() {
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
      {/* Encabezado con la imagen en el lateral izquierdo */}
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
        {/* Imagen en el lateral izquierdo */}
        <img 
          src={logoImage} 
          alt="Logo" 
          style={{
            marginTop:'2px',
            position: 'absolute',
            left: '20px',
            width: '250px', // Ajusta el tamaño del logo
          }}
        />
      </div>
 {/* Texto centrado */}
      <h1 style={{ fontSize: '3rem', margin: '0', textAlign: 'center', shadow: '0px 4px 12px rgba(0, 0, 0, 0.3)'}}>
          ¡Bienvenido/a de nuevo!
        </h1>
      {/* Contenedor de los botones e imágenes */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '50%', 
          marginTop: '100px', // Ajusta para que los botones queden más abajo
        }}
      >
        {/* Botón de Resúmenes */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={resumenesImage} 
            alt="Resúmenes" 
            style={{ width: '150px', marginBottom: '10px' }}
          />
          <button style={{ padding: '10px 20px' }}>Resúmenes</button>
        </div>

        {/* Botón de Comunidad */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={comunidadImage} 
            alt="Comunidad" 
            style={{ width: '200px', marginBottom: '20px' }}
          />
          <button style={{ padding: '10px 20px' }}>Comunidad</button>
        </div>
      </div>
    </div>
  );
}

export default Bienvenido;
