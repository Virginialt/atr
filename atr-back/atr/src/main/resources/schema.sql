-- Crear tabla 'areas'
CREATE TABLE areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- Clave primaria
    nombre VARCHAR(100) NOT NULL UNIQUE,   -- Nombre del área
    nivel ENUM('GRADO', 'PREGRADO') NOT NULL,  -- Nivel (GRADO o PREGRADO)
    estado ENUM ('ACTIVA', 'ELIMINADA') NOT NULL   -- ESTADO
);

-- Crear tabla 'materias'
CREATE TABLE materias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- Clave primaria
    nombre VARCHAR(100) NOT NULL UNIQUE,   -- Nombre de la materia
    area_id BIGINT NOT NULL,  -- Clave foránea que apunta a 'areas'
    anio INT NOT NULL,  -- Año de la materia (entre 1 y 5)
    estado ENUM ('ACTIVA', 'ELIMINADA') NOT NULL   -- ESTADO
    CONSTRAINT fk_area_materia FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,  -- Relación con áreas
);

-- Crear tabla intermedia 'area_materias' para la relación ManyToMany
CREATE TABLE area_materias (
    area_id BIGINT NOT NULL,  -- Clave foránea que apunta a 'areas'
    materia_id BIGINT NOT NULL,  -- Clave foránea que apunta a 'materias'
    PRIMARY KEY (area_id, materia_id),
    CONSTRAINT fk_area FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,
    CONSTRAINT fk_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);
