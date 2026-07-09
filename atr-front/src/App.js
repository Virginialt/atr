import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import profilePic from './assets/img/einstein.png';
import logo from './assets/img/logoatr.png';

const API_BASE = 'http://localhost:8080/api/v1';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setEmailError('Por favor, complete todos los campos.');
      return;
    }
    setEmailError('');
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data));
        navigate('/');
      } else {
        const err = await response.json();
        setLoginError(err.error || 'Email o contraseña incorrectos.');
      }
    } catch {
      setLoginError('Error de conexión con el servidor.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/registro');
  };

  return (
    <div className="login-container">
      <div className="header">
        <img src={logo} alt="Logo ATR" className="header-logo" />
        <button className="signup-button" onClick={handleRegisterClick}>Registrarse</button>
      </div>

      <div className="profile-picture">
        <img src={profilePic} alt="Profile" />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
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
            onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
            required
          />
        </div>
        {loginError && <p className="error" style={{ color: 'red' }}>{loginError}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default App;
