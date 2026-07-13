import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import profilePic from './assets/img/einstein.png';
import logo from './assets/img/logoatr.png';
import { API_BASE } from './api';

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
        <button className="header-btn-white" onClick={handleRegisterClick}>Registrarse</button>
      </div>

      <img src={profilePic} alt="Profile" className="login-avatar" />

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
          required
          style={{ marginBottom: '20px' }}
        />
        {emailError && <p className="error-text">{emailError}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
          required
          style={{ marginBottom: '24px' }}
        />

        {loginError && <p className="error-text" style={{ marginBottom: '12px' }}>{loginError}</p>}
        <button type="submit" className="btn btn-lg">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default App;
