import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '15px',
    color: '#333',
    marginBottom: '5px',
  },
  input: {
    padding: '12px 14px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '12px 14px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  button: {
    padding: '14px',
    fontSize: '17px',
    backgroundColor: '#4a1010',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '12px',
  },
};

function RegistroFormulario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    rol: 'ESTUDIANTE',
    carreraId: '',
    año: '',
  });

  const [carreras, setCarreras] = useState([]);
  const [respuesta, setRespuesta] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    api('/area')
      .then((response) => response.json())
      .then((data) => setCarreras(data))
      .catch(() => console.error('Error al cargar carreras'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      año: formData.año ? parseInt(formData.año, 10) : null,
      carreraId: formData.carreraId ? parseInt(formData.carreraId, 10) : null,
    };

    api('/usuario/registrar', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setExito(true);
          setRespuesta('Registro exitoso. Redirigiendo al login...');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setRespuesta(data.message || 'Error en el registro.');
        }
      })
      .catch(() => {
        setRespuesta('Error de conexión con el servidor.');
      });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="nombre">Nombre:</label>
        <input style={styles.input} type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="apellido">Apellido:</label>
        <input style={styles.input} type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="email">Email:</label>
        <input style={styles.input} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="contraseña">Contraseña:</label>
        <input style={styles.input} type="password" id="contraseña" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="rol">Rol:</label>
        <select style={styles.select} id="rol" name="rol" value={formData.rol} onChange={handleChange} required>
          <option value="ESTUDIANTE">Alumno</option>
          <option value="TUTOR">Tutor</option>
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="carreraId">Carrera:</label>
        <select style={styles.select} id="carreraId" name="carreraId" value={formData.carreraId} onChange={handleChange} required>
          <option value="">Selecciona una carrera</option>
          {carreras.map((carrera) => (
            <option key={carrera.id} value={carrera.id}>
              {carrera.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="año">Año:</label>
        <input style={styles.input} type="number" id="año" name="año" value={formData.año} onChange={handleChange} required />
      </div>

      <button type="submit" style={styles.button}>Registrarse</button>

      {respuesta && (
        <div style={{ marginTop: '10px', textAlign: 'center', color: exito ? 'green' : 'red' }}>{respuesta}</div>
      )}
    </form>
  );
}

export default RegistroFormulario;
