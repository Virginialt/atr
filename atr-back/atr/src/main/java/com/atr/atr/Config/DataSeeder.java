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
        if (grupoRepository.count() > 5) return;

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
            GrupoEstudio g1 = crearGrupo("Estudio Algebra de Boole", "Grupo para repasar algebra de Boole y preparar el parcial. Resolvemos ejercicios juntos y compartimos material.", matDiscreta, maria, 5);
            if (g1 != null) {
                agregarMiembro(g1, juan);
                agregarMiembro(g1, ana);
                crearEncuentro(g1, "Repaso general pre-parcial", "Biblioteca central - 2do piso", LocalDateTime.now().plusDays(5), maria);
            }

            GrupoEstudio g2 = crearGrupo("Algoritmos: Resolviendo juntos", "Resolvemos ejercicios de algoritmos y estructuras de datos. Desde pseudocodigo hasta implementacion.", algoritmos, ana, 4);
            if (g2 != null) {
                agregarMiembro(g2, juan);
                crearEncuentro(g2, "Meet de consulta semanal", "Google Meet - link por privado", LocalDateTime.now().plusDays(3), ana);
            }

            GrupoEstudio g3 = crearGrupo("Matematica Discreta - Parcial 2", "Preparamos el segundo parcial de Matematica Discreta. Vemos relaciones, grafos y arboles.", matDiscreta, juan, 6);
            if (g3 != null) {
                agregarMiembro(g3, ana);
                agregarMiembro(g3, maria);
                crearEncuentro(g3, "Resolucion de parciales anteriores", "Aula 204 - UTN", LocalDateTime.now().plusDays(7), juan);
                crearEncuentro(g3, "Teoria de grafos en la practica", "Laboratorio de informatica", LocalDateTime.now().plusDays(10), maria);
            }
        }

        if (sistOrg != null && algoritmos != null) {
            GrupoEstudio g4 = crearGrupo("TP Sistemas y Organizaciones", "Grupo para coordinar la entrega del TP final de Sistemas. Nos juntamos a definir los requisitos y la documentacion.", sistOrg, maria, 4);
            if (g4 != null) {
                agregarMiembro(g4, ana);
                agregarMiembro(g4, juan);
                crearEncuentro(g4, "Definicion de alcance del TP", "Biblioteca - Sector grupos", LocalDateTime.now().plusDays(2), maria);
            }

            GrupoEstudio g5 = crearGrupo("Programacion Competitiva", "Practicamos para competencias de programacion. Resolvemos problemas de plataformas como Codeforces y LeetCode.", algoritmos, carlos, 10);
            if (g5 != null) {
                agregarMiembro(g5, ana);
                agregarMiembro(g5, maria);
                agregarMiembro(g5, juan);
                crearEncuentro(g5, "Maraton de programacion semanal", "Labo 3 - Piso 1", LocalDateTime.now().plusDays(1), carlos);
            }

            GrupoEstudio g6 = crearGrupo("Estudio general - 1er año", "Grupo abierto para estudiantes de 1er año. Compartimos apuntes, resolvemos dudas y organizamos sesiones de estudio.", matDiscreta, ana, 12);
            if (g6 != null) {
                agregarMiembro(g6, juan);
                agregarMiembro(g6, maria);
                crearEncuentro(g6, "Meet semanal de consultas", "Discord - servidor del grupo", LocalDateTime.now().plusDays(6), ana);
                crearEncuentro(g6, "Maraton de ejercicios de parcial", "Aula 101", LocalDateTime.now().plusDays(12), juan);
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

        crearMensaje(carlos, juan, "Hola Juan! Soy Carlos, tutor de Algoritmos. Vi tu consulta sobre el TP, cualquier cosa avisame.");
        crearMensaje(juan, carlos, "Hola Carlos! Gracias por escribirme. Justo estaba con una duda sobre el pseudocodigo del ejercicio 4.");
        crearMensaje(carlos, juan, "Dale, contame cual es exactamente. El de ordenamiento o el de busqueda?");
        crearMensaje(juan, carlos, "El de busqueda binaria. No me queda claro cuando usar 'mientras' en vez de 'para'.");
        crearMensaje(carlos, juan, "Ah, buen punto! En busqueda binaria usamos 'mientras' porque no sabemos cuantas iteraciones vamos a necesitar. 'Para' se usa cuando conocemos la cantidad exacta.");
        crearMensaje(juan, carlos, "Ahora entendi! Muchas gracias Carlos, me re ayudaste.");
        crearMensaje(carlos, juan, "De nada! Cualquier cosa segui consultando. Suerte con el TP.");

        crearMensaje(maria, juan, "Hola Juan! Te queria consultar si ya viste el material que subi sobre Algebra de Boole.");
        crearMensaje(juan, maria, "Hola Maria! Si, lo vi. Me parecio muy claro, sobre todo la parte de simplificacion.");
        crearMensaje(maria, juan, "Me alegra! Si queres practicar mas, tengo ejercicios extra. Te los puedo pasar.");
        crearMensaje(juan, maria, "Dale, acepto! Pasamelos cuando puedas.");
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
