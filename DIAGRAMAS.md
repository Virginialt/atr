# Diagramas del Proyecto — A Todo Resumen

---

## 1. Diagrama de Clases (Backend)

```mermaid
classDiagram
    class Usuario {
        +Long id
        +String nombre
        +String apellido
        +String email
        +String contraseña
        +Rol rol
        +Integer año
        +Carrera carrera
    }
    class Carrera {
        +Long id
        +String nombre
    }
    class Resumen {
        +Long id
        +String titulo
        +String descripcion
        +String archivoUrl
        +Estado estado
        +Double promedioPuntaje
        +Date createdAt
    }
    class Valoracion {
        +Long id
        +Integer puntuacion
        +String comentario
        +Date createdAt
    }
    class Foro {
        +Long id
        +String titulo
        +String contenido
        +EstadoForo estado
        +Integer cantidadComentarios
        +Date createdAt
    }
    class ComentarioForo {
        +Long id
        +String contenido
        +Date createdAt
    }
    class GrupoEstudio {
        +Long id
        +String nombre
        +String descripcion
        +Integer maxIntegrantes
        +Integer cantidadMiembros
    }
    class GrupoEstudioMiembro {
        +Long id
        +Date fechaUnion
    }
    class Encuentro {
        +Long id
        +String titulo
        +String descripcion
        +String ubicacion
        +LocalDateTime fechaHora
    }
    class Mensaje {
        +Long id
        +String contenido
        +Date createdAt
        +Boolean leido
    }
    class Materia {
        +Long id
        +String nombre
    }
    class Area {
        +Long id
        +String nombre
    }

    Usuario --> Carrera
    Usuario --> Resumen : crea
    Resumen --> Materia
    Resumen --> Valoracion : tiene
    Valoracion --> Usuario : usuario
    Foro --> Usuario : creador
    Foro --> Materia
    Foro --> ComentarioForo : contiene
    ComentarioForo --> Usuario : autor
    GrupoEstudio --> Usuario : creador
    GrupoEstudio --> Materia
    GrupoEstudio --> GrupoEstudioMiembro : miembros
    GrupoEstudioMiembro --> Usuario : usuario
    GrupoEstudio --> Encuentro : encuentros
    Encuentro --> Usuario : creador
    Mensaje --> Usuario : remitente
    Mensaje --> Usuario : destinatario
    Area --> Materia : contiene
```

---

## 2. Diagrama de Casos de Uso

```mermaid
flowchart TD
    subgraph Visitante["Visitante (sin login)"]
        V1[Ver resúmenes]
        V2[Buscar y filtrar resúmenes]
        V3[Ver hilos del foro]
        V4[Ver grupos de estudio]
        V5[Ver tutores disponibles]
        V6[Iniciar sesión]
        V7[Registrarse]
    end

    subgraph Usuario["Usuario (logueado)"]
        U1[Subir resumen]
        U2[Ver archivo completo]
        U3[Valorar y comentar resumen]
        U4[Crear hilo en foro]
        U5[Comentar en hilo]
        U6[Cerrar/Eliminar hilo propio]
        U7[Crear grupo de estudio]
        U8[Unirse a grupo]
        U9[Salir de grupo]
        U10[Crear encuentro]
        U11[Chatear con tutores]
        U12[Ver conversaciones]
    end

    subgraph Tutor["Tutor"]
        T1[Recibir mensajes]
        T2[Responder consultas]
    end

    Visitante -->|login| Usuario
```

---

## 3. Diagrama de Arquitectura (Componentes)

```mermaid
flowchart LR
    subgraph Frontend["Frontend React (localhost:3000)"]
        Pages["Pages<br/>(Resumenes, Foro, Grupos,<br/>Mensajes, Login, etc.)"]
        Components["Components<br/>(ModalResumen, ResumenCard,<br/>SubirResumen, etc.)"]
        Api["api.js<br/>(fetch wrapper + JWT)"]
        Router["AppRouter.js<br/>(React Router)"]
    end

    subgraph Backend["Backend Spring Boot (localhost:8080)"]
        direction TB
        Controllers["Controllers<br/>(REST endpoints)"]
        Services["Services<br/>(Business logic)"]
        Repositories["Repositories<br/>(JPA / Hibernate)"]
        Security["Security<br/>(JWT Filter + Security Config)"]
        Entities["Entities<br/>(Modelos JPA)"]
    end

    subgraph Storage["Almacenamiento"]
        DB[("MySQL<br/>a_todo_resumen")]
        Files[("Archivos<br/>uploads/resumenes/")]
    end

    Frontend -->|HTTP JSON + JWT| Backend
    Backend --> DB
    Backend --> Files

    Router --> Pages
    Pages --> Components
    Pages --> Api
    Api -->|fetch + Bearer token| Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Entities
    Security --> Controllers
```

---

## 4. Diagrama de Base de Datos (DER)

```mermaid
erDiagram
    USUARIO ||--o{ RESUMEN : crea
    USUARIO ||--o{ VALORACION : hace
    USUARIO ||--o{ FORO : crea
    USUARIO ||--o{ COMENTARIO_FORO : escribe
    USUARIO ||--o{ GRUPO_ESTUDIO : crea
    USUARIO ||--o{ GRUPO_ESTUDIO_MIEMBRO : integra
    USUARIO ||--o{ ENCUENTRO : organiza
    USUARIO ||--o{ MENSAJE : envia
    USUARIO ||--o{ MENSAJE : recibe
    USUARIO }o--|| CARRERA : cursa

    CARRERA ||--o{ MATERIA : tiene

    MATERIA ||--o{ RESUMEN : clasifica
    MATERIA ||--o{ FORO : etiqueta
    MATERIA ||--o{ GRUPO_ESTUDIO : etiqueta

    RESUMEN ||--o{ VALORACION : recibe
    FORO ||--o{ COMENTARIO_FORO : contiene

    GRUPO_ESTUDIO ||--o{ GRUPO_ESTUDIO_MIEMBRO : tiene
    GRUPO_ESTUDIO ||--o{ ENCUENTRO : programa
```
