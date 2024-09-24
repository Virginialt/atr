import React, { useState } from 'react';
import backgroundImage from '../assets/ATR-20240904T142512Z-001/libros.jpg';
import logoImage from '../assets/ATR-20240904T142512Z-001/logoatr.png';

const carreras = [
  'Ingeniería en Sistemas de Información',
  'Ingeniería Electrónica',
  'Ingeniería Civil',
  'Ingeniería Química',
  'Ingeniería Mecánica',
  'Ingeniería Industrial',
];

function Register() {
  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleCarreraChange = (event) => {
    setSelectedCarrera(event.target.value);
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
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
        color: 'black',
        fontFamily: 'Open Sans',
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
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adding shadow to the header
        }}
      >
        {/* Imagen en el lateral izquierdo */}
        <img 
          src={logoImage} 
          alt="Logo" 
          style={{
            marginTop: '2px',
            position: 'absolute',
            left: '20px',
            width: '250px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adding shadow to the logo
          }}
        />
      </div>

      {/* Formulario de Registro */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        width: '300px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' // Centering the form content
      }}>
        <form style={{ width: '100%' }}>
          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            <label style={{ color: 'black' }}>Foto de Perfil:</label>
            <input type="file" accept="image/*" onChange={handleProfileImageChange} />
            {profileImagePreview && (
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <img src={profileImagePreview} alt="Vista previa" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>Nombre:</label>
            <input type="text" placeholder="Ingrese su nombre" />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>Fecha de nacimiento:</label>
            <input type="date" />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>Correo Electrónico:</label>
            <input type="email" placeholder="Ingrese su correo electrónico" />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>Contraseña:</label>
            <input type="password" placeholder="Ingrese su contraseña" />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>Carrera:</label>
            <select value={selectedCarrera} onChange={handleCarreraChange}>
              <option value="">Seleccione su carrera</option>
              {carreras.map((carrera, index) => (
                <option key={index} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>Año:</label>
            <input type="text" placeholder="Ingrese el año" />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'black' }}>¿Te gustaría ser tutor?</label>
            <div>
              <input type="radio" id="tutorNo" name="tutor" value="no" />
              <label htmlFor="tutorNo" style={{ color: 'black' }}>No</label>

              <input type="radio" id="tutorSi" name="tutor" value="si" />
              <label htmlFor="tutorSi" style={{ color: 'black' }}>Sí</label>
            </div>
          </div>

          <button type="submit" style={{ backgroundColor: 'rgba(117, 28, 28)', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
