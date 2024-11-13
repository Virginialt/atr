import React, { useState, useEffect } from 'react';

function RegistroFormulario() {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    rol: 'Alumno',
    carrera_id: '',
    año: '',
    foto: null, // Estado para la foto
    materias: [],
  });

  const [carreras, setCarreras] = useState([]); // Estado para las carreras
  const [materias, setMaterias] = useState([]); // Estado para las materias
  const [preview, setPreview] = useState(''); // Estado para la vista previa de la imagen
  const [respuesta, setRespuesta] = useState('');

  // Cargar la lista de carreras al montar el componente
  useEffect(() => {
    fetch('/api/carreras')
      .then((response) => response.json())
      .then((data) => setCarreras(data))
      .catch((error) => console.error('Error al cargar carreras:', error));
  }, []);

  // Cargar materias relacionadas cuando se selecciona una carrera
  useEffect(() => {
    if (formData.carrera_id) {
      fetch(`/api/materias?carrera_id=${formData.carrera_id}`)
        .then((response) => response.json())
        .then((data) => setMaterias(data))
        .catch((error) => console.error('Error al cargar materias:', error));
    }
  }, [formData.carrera_id]);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value, // Guardar archivo si es tipo 'file'
    });

    // Si el input es un archivo, establecer la vista previa
    if (type === 'file' && files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result); // Establecer el resultado como la vista previa
      };
      fileReader.readAsDataURL(files[0]); // Leer el archivo como URL de datos
    } else {
      setPreview(''); // Limpiar la vista previa si no es un archivo
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir que el formulario recargue la página

    const formDataToSend = new FormData(); // Usar FormData para manejar archivos
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Enviar datos al servidor usando Fetch API
    fetch('/backend/registrar_usuario.php', {
      method: 'POST',
      body: formDataToSend, // Enviar FormData directamente
    })
      .then((response) => response.json())
      .then((result) => {
        // Actualizar la respuesta con el mensaje del servidor
        setRespuesta(result.message);
      })
      .catch((error) => {
        console.error('Error:', error);
        setRespuesta('Error en el registro.');
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Vista previa de la imagen en la parte superior */}
      {preview && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <img
            src={preview}
            alt="Vista previa"
            style={{
              maxWidth: '100%', // Limitar el ancho máximo
              maxHeight: '200px', // Limitar la altura máxima
              borderRadius: '8px', // Bordes redondeados
            }}
          />
        </div>
      )}

      {/* Campo para cargar la foto de perfil */}
      <label htmlFor="foto">Foto de perfil:</label>
      <input
        type="file"
        id="foto"
        name="foto"
        accept="image/*" // Solo acepta imágenes
        onChange={handleChange}
        required
      />

      <label htmlFor="nombre">Nombre:</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="contraseña">Contraseña:</label>
      <input
        type="password"
        id="contraseña"
        name="contraseña"
        value={formData.contraseña}
        onChange={handleChange}
        required
      />

      <label htmlFor="rol">Rol:</label>
      <select id="rol" name="rol" value={formData.rol} onChange={handleChange} required>
        <option value="Alumno">Alumno</option>
        <option value="Tutor">Tutor</option>
      </select>

      {/* Selección de carrera */}
      <label htmlFor="carrera_id">Carrera:</label>
      <select
        id="carrera_id"
        name="carrera_id"
        value={formData.carrera_id}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona una carrera</option>
        {carreras.map((carrera) => (
          <option key={carrera.id} value={carrera.id}>
            {carrera.nombre}
          </option>
        ))}
      </select>

      {/* Si el rol es Tutor, mostrar las materias */}
      {formData.rol === 'Tutor' && (
        <>
          <label htmlFor="materias">Materias para tutoría:</label>
          <select
            id="materias"
            name="materias"
            multiple // Permitir seleccionar varias materias
            value={formData.materias}
            onChange={handleChange}
          >
            {materias.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </>
      )}

      <label htmlFor="año">Año:</label>
      <input
        type="number"
        id="año"
        name="año"
        value={formData.año}
        onChange={handleChange}
        required
      />

      <button type="submit" style={{ marginTop: '20px' }}>Registrarse</button>
      
      {respuesta && <div>{respuesta}</div>} {/* Mostrar la respuesta del servidor */}
    </form>
  );
}

export default RegistroFormulario;
