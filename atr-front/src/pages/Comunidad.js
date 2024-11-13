import React, { useState, useEffect } from 'react';
import logoImage from '../assets/img/logoatr.png';
import backgroundImage from '../assets/img/libros.jpg';
import defaultProfilePic from '../assets/img/einstein.png'; // Asegúrate de tener una imagen por defecto

const Comunidad = () => {
  const [tutors, setTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Ejemplo de datos de tutores (reemplazar con llamada a la API)
  useEffect(() => {
    // Aquí harías la llamada a tu API
    const fetchTutors = async () => {
      // Simular datos de tutores
      const mockTutors = [
        {
          id: 1,
          name: 'Ana García',
          subjects: ['Matemáticas', 'Física'],
          rating: 4.8,
          description: 'Profesora con 5 años de experiencia en matemáticas avanzadas',
          photo: defaultProfilePic,
          price: '1500/hora'
        },
        {
          id: 2,
          name: 'Carlos Rodríguez',
          subjects: ['Química', 'Biología'],
          rating: 4.6,
          description: 'Especialista en ciencias naturales, enfoque práctico',
          photo: defaultProfilePic,
          price: '1300/hora'
        },
        // Agregar más tutores aquí
      ];
      setTutors(mockTutors);
    };

    fetchTutors();
  }, []);

  // Filtrar tutores basado en búsqueda y materia
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  // Obtener lista única de materias para el filtro
  const allSubjects = [...new Set(tutors.flatMap(tutor => tutor.subjects))];

  const handleContactClick = (tutorId) => {
    // Aquí implementarías la lógica para abrir el chat
    console.log(`Contactando al tutor ${tutorId}`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Comic Sans MS',
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(117, 28, 28)',
          padding: '20px',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
        }}
      >
        <img 
          src={logoImage} 
          alt="Logo" 
          style={{
            width: '250px',
            marginLeft: '20px',
          }}
        />
      </div>

      {/* Contenido principal */}
      <div style={{ paddingTop: '100px', padding: '120px 5% 50px 5%' }}>
        {/* Filtros y búsqueda */}
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar tutores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                width: '300px'
              }}
            />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: 'none'
              }}
            >
              <option value="all">Todas las materias</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de tutores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {filteredTutors.map(tutor => (
            <div
              key={tutor.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '10px',
                padding: '20px',
                color: 'black',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <img
                src={tutor.photo}
                alt={tutor.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  alignSelf: 'center'
                }}
              />
              <h3 style={{ margin: '10px 0', textAlign: 'center' }}>{tutor.name}</h3>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {tutor.subjects.map(subject => (
                  <span
                    key={subject}
                    style={{
                      backgroundColor: '#4a1010',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '0.8em'
                    }}
                  >
                    {subject}
                  </span>
                ))}
              </div>
              <p style={{ margin: '5px 0' }}>{tutor.description}</p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto'
              }}>
                <span>⭐ {tutor.rating}</span>
                <span>{tutor.price}</span>
              </div>
              <button
                onClick={() => handleContactClick(tutor.id)}
                style={{
                  backgroundColor: '#4a1010',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  fontWeight: 'bold'
                }}
              >
                Contactar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comunidad;