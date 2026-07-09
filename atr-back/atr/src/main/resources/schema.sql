CREATE TABLE IF NOT EXISTS areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    nivel ENUM('GRADO', 'PREGRADO') NOT NULL,
    estado ENUM('ACTIVA', 'ELIMINADA') NOT NULL
);

CREATE TABLE IF NOT EXISTS materias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    area_id BIGINT NOT NULL,
    anio INT NOT NULL,
    cuatrimestre INT,
    estado ENUM('ACTIVA', 'ELIMINADA') NOT NULL,
    CONSTRAINT fk_area_materia FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS area_materias (
    area_id BIGINT NOT NULL,
    materia_id BIGINT NOT NULL,
    PRIMARY KEY (area_id, materia_id),
    CONSTRAINT fk_area FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,
    CONSTRAINT fk_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('ESTUDIANTE', 'TUTOR') NOT NULL,
    carrera_id BIGINT,
    año INT,
    CONSTRAINT fk_usuario_carrera FOREIGN KEY (carrera_id) REFERENCES areas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS resumenes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    archivo_url VARCHAR(500),
    materia_id BIGINT,
    usuario_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    valoracion_promedio DOUBLE DEFAULT 0,
    estado ENUM('ACTIVO', 'ELIMINADO') NOT NULL,
    CONSTRAINT fk_resumen_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE SET NULL,
    CONSTRAINT fk_resumen_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS valoraciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    resumen_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    puntuacion INT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_valoracion_resumen FOREIGN KEY (resumen_id) REFERENCES resumenes(id) ON DELETE CASCADE,
    CONSTRAINT fk_valoracion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS foros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    materia_id BIGINT,
    usuario_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    estado ENUM('ACTIVO', 'CERRADO', 'ELIMINADO') NOT NULL,
    CONSTRAINT fk_foro_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE SET NULL,
    CONSTRAINT fk_foro_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comentarios_foro (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    foro_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_comentario_foro FOREIGN KEY (foro_id) REFERENCES foros(id) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grupos_estudio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    materia_id BIGINT,
    creador_id BIGINT NOT NULL,
    max_integrantes INT,
    created_at DATETIME NOT NULL,
    estado ENUM('ACTIVO', 'FINALIZADO', 'ELIMINADO') NOT NULL,
    CONSTRAINT fk_grupo_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE SET NULL,
    CONSTRAINT fk_grupo_creador FOREIGN KEY (creador_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grupo_estudio_miembros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grupo_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    fecha_union DATETIME NOT NULL,
    CONSTRAINT fk_miembro_grupo FOREIGN KEY (grupo_id) REFERENCES grupos_estudio(id) ON DELETE CASCADE,
    CONSTRAINT fk_miembro_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS encuentros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grupo_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    fecha_hora DATETIME NOT NULL,
    creador_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_encuentro_grupo FOREIGN KEY (grupo_id) REFERENCES grupos_estudio(id) ON DELETE CASCADE,
    CONSTRAINT fk_encuentro_creador FOREIGN KEY (creador_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mensajes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    remitente_id BIGINT NOT NULL,
    destinatario_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_mensaje_remitente FOREIGN KEY (remitente_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_mensaje_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
