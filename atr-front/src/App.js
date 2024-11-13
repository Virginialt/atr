import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import profilePic from './assets/img/einstein.png';
import logo from './assets/img/logoatr.png';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  
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
    // En lugar de cambiar isLoggedIn, navegamos directamente a /bienvenido
    navigate('/bienvenido');
  };

  const handleRegisterClick = () => {
    navigate('/registro');
  };

  return (
    <div className="login-container">
      <div className="header-container">
        <button className="signup-button" onClick={handleRegisterClick}>Registrarse</button>
        <div className="header">
          <img src={logo} alt="Logo ATR" className="header-logo" />
        </div>
      </div>

      <div className="profile-picture">
        <img src={profilePic} alt="Profile" />
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
    </div>
  );
}

export default App;