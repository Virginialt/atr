import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/img/libros.jpg';
import defaultProfilePic from '../assets/img/einstein.png';
import Header from '../components/Header';

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
        fontFamily: 'Open Sans, sans-serif',
      }}
    >
      <Header />

      <div style={{ padding: '95px 5% 50px', animation: 'fadeIn 0.3s ease' }}>
        <div className="filter-bar">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar tutores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '280px' }}
            />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
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
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
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
                  <span key={subject} className="tag" style={{ padding: '5px 10px' }}>{subject}</span>
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
              <button onClick={() => handleContactClick(tutor.id)} className="btn" style={{ width: '100%' }}>
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