INSERT IGNORE INTO areas (nombre, nivel, estado) VALUES
('Ingeniería en Sistemas de Información', 'GRADO', 'ACTIVA'),
('Ingeniería Química', 'GRADO', 'ACTIVA'),
('Ingeniería Electrónica', 'GRADO', 'ACTIVA'),
('Ingeniería Civil', 'GRADO', 'ACTIVA'),
('Ingeniería Mecánica', 'GRADO', 'ACTIVA'),
('Licenciatura en Administración Rural', 'GRADO', 'ACTIVA'),
('Tecnicatura en Logística', 'PREGRADO', 'ACTIVA'),
('Tecnicatura en Mecatrónica', 'PREGRADO', 'ACTIVA'),
('Tecnicatura en Negociación de Bienes', 'PREGRADO', 'ACTIVA'),
('Tecnicatura en Programación', 'PREGRADO', 'ACTIVA');

INSERT IGNORE INTO materias (nombre, area_id, anio, cuatrimestre, estado) VALUES
('Algoritmos y Estructuras de Datos', 1, 1, 1, 'ACTIVA'),
('Matemática Discreta', 1, 1, 2, 'ACTIVA'),
('Sistemas y Organizaciones', 1, 1, 1, 'ACTIVA'),
('Arquitectura de Computadoras', 1, 1, 2, 'ACTIVA'),
('Paradigmas de Programación', 1, 2, 1, 'ACTIVA'),
('Ingeniería Mecánica I', 5, 1, 1, 'ACTIVA'),
('Ingeniería Mecánica II', 5, 2, 1, 'ACTIVA'),
('Química General', 2, 1, 1, 'ACTIVA'),
('Análisis Matemático I', 1, 1, 1, 'ACTIVA'),
('Análisis Matemático II', 1, 1, 2, 'ACTIVA');

INSERT IGNORE INTO area_materias (area_id, materia_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 9), (1, 10),
(5, 6), (5, 7),
(2, 8);
