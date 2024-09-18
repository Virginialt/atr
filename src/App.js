import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './App.css';
import profilePic from './assets/ATR-20240904T142512Z-001/einstein.png'; // Importa la imagen

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Usa useNavigate para redirigir

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
      return;
    }
    setEmailError('');
    setIsLoggedIn(true);
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Redirige a la página de registro
  };

  if (isLoggedIn) {
    return (
      <div className="welcome-container">
        <h1>¡Bienvenido/a de nuevo!</h1>
        <div className="buttons">
          <button>Resúmenes</button>
          <button>Comunidad</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Contenedor del encabezado y el botón */}
      <div className="header-container">
        {/* Botón de registro encima del encabezado */}
        <button className="signup-button" onClick={handleRegisterClick}>Registrarse</button>
        {/* Encabezado */}
        <div className="header"></div>
      </div>

      {/* Imagen de perfil */}
      <div className="profile-picture">
        <img src={profilePic} alt="Profile" /> {/* Usa la imagen importada */}
      </div>

      {/* Formulario de inicio de sesión */}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Gmail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default App;
