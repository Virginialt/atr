INSERT INTO areas (nombre, nivel, estado)
VALUES
('Ingeniería en Sistemas de Información', 'GRADO', 'ACTIVA'),
('Ingeniería Química', 'GRADO', 'ACTIVA'),
('Ingeniería Electrónica', 'GRADO', 'ACTIVA'),
('Ingeniería Civíl', 'GRADO', 'ACTIVA'),
('Ingeniería Mecánica', 'GRADO', 'ACTIVA'),
('Licenciatura en Adm Rural', 'GRADO', 'ACTIVA'),
('Tec en Logistica', 'PREGRADO', 'ACTIVA'),
('Tec en Mecatrónica', 'PREGRADO', 'ACTIVA'),
('Tec en Negociación de Bienes', 'PREGRADO', 'ACTIVA'),
('Tec en Programación', 'PREGRADO', 'ACTIVA');

-- Insertar datos en la tabla 'materias'
INSERT INTO materias (nombre, area_id, anio, estado)
VALUES
('Algoritmos y Estructuras de Datos', 1, 1, 'ACTIVA'),  
('Ingeniería Mecánica 1', 5, 1, 'ACTIVA');

-- Insertar datos en la tabla intermedia 'area_materias' (relación ManyToMany)
INSERT INTO area_materias (area_id, materia_id)
VALUES
(1, 1),  -- Ingeniería en Sistemas tiene Algoritmos y estructuras de datos
(5, 2);  -- Ingeniería Mecpanica tiene Ingenieria Mecánica 1