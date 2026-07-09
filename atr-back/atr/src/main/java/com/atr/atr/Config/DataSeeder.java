package com.atr.atr.Config;

import com.atr.atr.Model.*;
import com.atr.atr.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private AreaRepository areaRepository;
    @Autowired private MateriaRepository materiaRepository;
    @Autowired private ForoRepository foroRepository;
    @Autowired private ComentarioForoRepository comentarioForoRepository;
    @Autowired private GrupoEstudioRepository grupoRepository;
    @Autowired private GrupoEstudioMiembroRepository miembroRepository;
    @Autowired private EncuentroRepository encuentroRepository;
    @Autowired private ResumenRepository resumenRepository;
    @Autowired private ValoracionRepository valoracionRepository;
    @Autowired private MensajeRepository mensajeRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (foroRepository.count() > 0) return;

        if (areaRepository.count() == 0 || materiaRepository.count() == 0) return;

        Usuario maria = crearUsuario("Maria", "Garcia", "maria@test.com", "TUTOR", 1L, 3);
        Usuario carlos = crearUsuario("Carlos", "Lopez", "carlos@test.com", "TUTOR", 1L, 5);
        Usuario ana = crearUsuario("Ana", "Martinez", "ana@test.com", "ESTUDIANTE", 1L, 2);
        Usuario juan = crearUsuario("Juan", "Perez", "juan@test.com", "ESTUDIANTE", 1L, 1);

        Materia matDiscreta = materiaRepository.findById(2L).orElse(null);
        Materia sistOrg = materiaRepository.findById(3L).orElse(null);
        Materia algoritmos = materiaRepository.findById(1L).orElse(null);

        if (matDiscreta != null) {
            Foro foro1 = crearForo("Algebra de Boole - ayuda con ejercicios", "Alguien me puede explicar como simplificar expresiones usando algebra de Boole? No entiendo bien las leyes de absorcion.", matDiscreta, ana);
            if (foro1 != null) {
                crearComentario(foro1, juan, "Yo estoy cursando eso tambien. Te recomiendo los resumenes que subi a la seccion de Recursos.");
                crearComentario(foro1, maria, "Hola! Soy tutora de la materia. Las leyes de absorcion son: A + (A * B) = A y A * (A + B) = A. Practica con esos ejemplos y cualquier duda consultame.");
                crearComentario(foro1, ana, "Gracias Maria! Me ayudaste mucho. Voy a practicar con esos ejemplos.");
            }
        }

        if (sistOrg != null) {
            Foro foro2 = crearForo("TP Sistemas - consultas sobre la entrega", "Cuando es la fecha limite para entregar el TP? Tambien queria saber si se puede hacer en grupos de 3.", sistOrg, juan);
            if (foro2 != null) {
                crearComentario(foro2, ana, "Segun el cronograma, es hasta el 20 de julio. Y si, se puede en grupos de hasta 4 personas.");
                crearComentario(foro2, carlos, "Hola, soy Carlos, tutor de la catedra. Confirmo: fecha limite 20/07, grupos de hasta 4 integrantes. Recuerden usar la bibliografia recomendada.");
            }
        }

        if (matDiscreta != null && algoritmos != null) {
            GrupoEstudio g1 = crearGrupo("Estudio Algebra", "Grupo para repasar algebra de Boole y preparar el parcial", matDiscreta, maria, 5);
            if (g1 != null) {
                agregarMiembro(g1, juan);
                agregarMiembro(g1, ana);
                crearEncuentro(g1, "Repaso general pre-parcial", "Biblioteca central - 2do piso", LocalDateTime.now().plusDays(5), maria);
            }

            GrupoEstudio g2 = crearGrupo("Programacion 1 - Grupo de estudio", "Resolvemos ejercicios de algoritmos y estructuras de datos juntos", algoritmos, ana, 4);
            if (g2 != null) {
                agregarMiembro(g2, juan);
                crearEncuentro(g2, "Meet de consulta", "Google Meet - link por privado", LocalDateTime.now().plusDays(3), ana);
            }
        }

        if (matDiscreta != null && algoritmos != null) {
            Resumen r1 = crearResumen("Algebra de Boole - Resumen completo", "Leyes, tablas de verdad y ejercicios resueltos paso a paso.", matDiscreta, juan);
            if (r1 != null && ana != null) {
                crearValoracion(r1, ana, 5, "Excelente resumen, me ayudó mucho a entender el tema. Muy claro y completo.");
            }
            if (r1 != null && juan != null) {
                crearValoracion(r1, juan, 4, "Muy bueno, aunque faltaría un ejemplo más sobre derivadas parciales.");
            }

            Resumen r2 = crearResumen("Apuntes de Algoritmos - Unidad 1 y 2", "Resumen con ejemplos de pseudocodigo, estructuras secuenciales y condicionales.", algoritmos, ana);
            if (r2 != null && juan != null) {
                crearValoracion(r2, juan, 5, "Gran resumen de algoritmos, los ejemplos de pseudocódigo están muy bien explicados.");
            }
            if (r2 != null && ana != null) {
                crearValoracion(r2, ana, 4, "Buen material, hay un error en el ejemplo 3 del condicional anidado (falta cerrar el si no).");
            }
        }

        crearMensaje(maria, ana, "Hola Ana! Soy Maria, tutora de Algebra. Vi que preguntaste en el foro. Queres que nos juntemos a repasar?");
        crearMensaje(ana, maria, "Hola Maria! Si, me vendria muy bien. Tengo dudas con los diagramas de Venn.");
        crearMensaje(maria, ana, "Podemos encontrarnos este jueves en la biblioteca a las 15hs. Llevo ejercicios para practicar.");
        crearMensaje(ana, maria, "Perfecto, nos vemos alli! Muchas gracias.");
    }

    private Usuario crearUsuario(String nombre, String apellido, String email, String rol, Long carreraId, Integer anio) {
        if (usuarioRepository.findByEmail(email) != null) return usuarioRepository.findByEmail(email);
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setEmail(email);
        u.setContraseña(passwordEncoder.encode("password123"));
        u.setRol("TUTOR".equals(rol) ? Usuario.Rol.TUTOR : Usuario.Rol.ESTUDIANTE);
        u.setCarreraId(carreraId);
        u.setAño(anio);
        return usuarioRepository.save(u);
    }

    private Foro crearForo(String titulo, String contenido, Materia materia, Usuario usuario) {
        Foro f = new Foro();
        f.setTitulo(titulo);
        f.setContenido(contenido);
        f.setMateria(materia);
        f.setUsuario(usuario);
        f.setEstado(Foro.Estado.ACTIVO);
        f.setCreatedAt(LocalDateTime.now().minusDays(3));
        return foroRepository.save(f);
    }

    private void crearComentario(Foro foro, Usuario usuario, String contenido) {
        ComentarioForo c = new ComentarioForo();
        c.setForo(foro);
        c.setUsuario(usuario);
        c.setContenido(contenido);
        c.setCreatedAt(LocalDateTime.now().minusDays(2));
        comentarioForoRepository.save(c);
    }

    private GrupoEstudio crearGrupo(String nombre, String descripcion, Materia materia, Usuario creador, Integer max) {
        GrupoEstudio g = new GrupoEstudio();
        g.setNombre(nombre);
        g.setDescripcion(descripcion);
        g.setMateria(materia);
        g.setCreador(creador);
        g.setMaxIntegrantes(max);
        g.setEstado(GrupoEstudio.Estado.ACTIVO);
        g.setCreatedAt(LocalDateTime.now().minusDays(5));
        g = grupoRepository.save(g);

        GrupoEstudioMiembro m = new GrupoEstudioMiembro();
        m.setGrupo(g);
        m.setUsuario(creador);
        m.setFechaUnion(LocalDateTime.now().minusDays(5));
        miembroRepository.save(m);

        return g;
    }

    private void agregarMiembro(GrupoEstudio grupo, Usuario usuario) {
        if (!miembroRepository.existsByGrupoIdAndUsuarioId(grupo.getId(), usuario.getIdUsuario())) {
            GrupoEstudioMiembro m = new GrupoEstudioMiembro();
            m.setGrupo(grupo);
            m.setUsuario(usuario);
            m.setFechaUnion(LocalDateTime.now().minusDays(4));
            miembroRepository.save(m);
        }
    }

    private void crearEncuentro(GrupoEstudio grupo, String titulo, String ubicacion, LocalDateTime fecha, Usuario creador) {
        Encuentro e = new Encuentro();
        e.setGrupo(grupo);
        e.setTitulo(titulo);
        e.setUbicacion(ubicacion);
        e.setFechaHora(fecha);
        e.setCreador(creador);
        e.setCreatedAt(LocalDateTime.now().minusDays(2));
        encuentroRepository.save(e);
    }

    private Resumen crearResumen(String titulo, String descripcion, Materia materia, Usuario usuario) {
        Resumen r = new Resumen();
        r.setTitulo(titulo);
        r.setDescripcion(descripcion);
        r.setMateria(materia);
        r.setUsuario(usuario);
        r.setEstado(Resumen.Estado.ACTIVO);
        r.setCreatedAt(LocalDateTime.now().minusDays(2));
        r.setValoracionPromedio(0.0);
        return resumenRepository.save(r);
    }

    private void crearValoracion(Resumen resumen, Usuario usuario, int puntuacion, String comentario) {
        Valoracion v = new Valoracion();
        v.setResumen(resumen);
        v.setUsuario(usuario);
        v.setPuntuacion(puntuacion);
        v.setComentario(comentario);
        v.setCreatedAt(LocalDateTime.now().minusDays(1));
        valoracionRepository.save(v);
    }

    private void crearMensaje(Usuario remitente, Usuario destinatario, String contenido) {
        Mensaje m = new Mensaje();
        m.setRemitente(remitente);
        m.setDestinatario(destinatario);
        m.setContenido(contenido);
        m.setLeido(false);
        m.setCreatedAt(LocalDateTime.now().minusHours(2));
        mensajeRepository.save(m);
    }
}
