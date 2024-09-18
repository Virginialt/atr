import React, { useState } from 'react';
import './App.css';
import profilePic from './assets/ATR-20240904T142512Z-001/einstein.png'; // Importa la imagen

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    // Aquí iría la lógica de autenticación
    // Si la autenticación es exitosa:
    setIsLoggedIn(true);
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
      <div className="profile-picture">
        <img src={profilePic} alt="Profile" /> {/* Usa la imagen importada */}
      </div>
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
      <button className="signup-button">Registrarse</button>
    </div>
  );
}

export default App;
