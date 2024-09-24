import React, { useState } from 'react';

function Inicio({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

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
    setIsLoggedIn(true); // Cambiar el estado para mostrar la pantalla de bienvenida
  };

  return (
    <div className="login-container">
      {/* Formulario de inicio de sesión */}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" style={{ fontFamily: 'Comic Sans MS' }}>Gmail:</label>
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
          <label htmlFor="password" style={{ fontFamily: 'Comic Sans MS' }}>Contraseña:</label>
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

export default Inicio;
