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
        if (foroRepository.count() > 5) return;

        if (areaRepository.count() == 0 || materiaRepository.count() == 0) return;

        Materia alg = materiaRepository.findByNombreIgnoreCaseAndAreaId("Algoritmos y Estructuras de Datos", 1L);
        Materia md = materiaRepository.findByNombreIgnoreCaseAndAreaId("Lógica y Estructuras Discretas", 1L);
        Materia so = materiaRepository.findByNombreIgnoreCaseAndAreaId("Sistemas y Procesos de Negocios", 1L);

        Usuario maria = crearUsuario("Maria", "Garcia", "maria@test.com", "TUTOR", 1L, 3);
        Usuario carlos = crearUsuario("Carlos", "Lopez", "carlos@test.com", "TUTOR", 1L, 5);
        Usuario lucia = crearUsuario("Lucia", "Fernandez", "lucia@test.com", "TUTOR", 1L, 4);
        Usuario diego = crearUsuario("Diego", "Ramirez", "diego@test.com", "TUTOR", 1L, 5);
        Usuario valentina = crearUsuario("Valentina", "Torres", "vale@test.com", "TUTOR", 1L, 4);
        Usuario facundo = crearUsuario("Facundo", "Acosta", "facundo@test.com", "TUTOR", 1L, 3);
        Usuario camila = crearUsuario("Camila", "Mendoza", "camila@test.com", "TUTOR", 1L, 5);
        Usuario santiago = crearUsuario("Santiago", "Rivas", "santiago@test.com", "TUTOR", 1L, 4);
        Usuario ana = crearUsuario("Ana", "Martinez", "ana@test.com", "ESTUDIANTE", 1L, 2);
        Usuario juan = crearUsuario("Juan", "Perez", "juan@test.com", "ESTUDIANTE", 1L, 1);
        Usuario rocio = crearUsuario("Rocio", "Gimenez", "rocio@test.com", "ESTUDIANTE", 1L, 1);
        Usuario tomas = crearUsuario("Tomas", "Silva", "tomas@test.com", "ESTUDIANTE", 1L, 2);
        Usuario florencia = crearUsuario("Florencia", "Diaz", "florencia@test.com", "ESTUDIANTE", 1L, 3);
        Usuario martin = crearUsuario("Martin", "Ortiz", "martin@test.com", "ESTUDIANTE", 1L, 2);
        Usuario julieta = crearUsuario("Julieta", "Castillo", "julieta@test.com", "ESTUDIANTE", 1L, 1);
        Usuario leonardo = crearUsuario("Leonardo", "Morales", "leo@test.com", "ESTUDIANTE", 1L, 3);

        Usuario[] tutores = {maria, carlos, lucia, diego, valentina, facundo, camila, santiago};
        Usuario[] estudiantes = {ana, juan, rocio, tomas, florencia, martin, julieta, leonardo};

        if (md != null) {
            Foro f1 = crearForo("Algebra de Boole - ayuda con ejercicios", "Alguien me puede explicar como simplificar expresiones usando algebra de Boole? No entiendo bien las leyes de absorcion.", md, ana);
            if (f1 != null) {
                crearComentario(f1, juan, "Yo estoy cursando eso tambien. Te recomiendo los resumenes que subi a la seccion de Recursos.");
                crearComentario(f1, maria, "Hola! Soy tutora de la materia. Las leyes de absorcion son: A + (A * B) = A y A * (A + B) = A. Practica con esos ejemplos y cualquier duda consultame.");
                crearComentario(f1, ana, "Gracias Maria! Me ayudaste mucho. Voy a practicar con esos ejemplos.");
                crearComentario(f1, rocio, "A mi tambien me servia! Maria, tenes algun ejercicio para practicar?");
                crearComentario(f1, maria, "Rocio, te paso unos ejercicios por privado. Escribime al chat :)");
            }

            Foro f2 = crearForo("Duda sobre conjuntos - union e interseccion", "Cual es la diferencia entre union y interseccion de conjuntos? En los diagramas de Venn los veo parecidos.", md, rocio);
            if (f2 != null) {
                crearComentario(f2, tomas, "La union incluye todos los elementos de ambos conjuntos, la interseccion solo los que estan en ambos.");
                crearComentario(f2, lucia, "Exacto! En el diagrama, la union es el area completa de ambos circulos, la interseccion es la parte donde se superponen.");
                crearComentario(f2, maria, "Complemento: union = 'o' (al menos uno), interseccion = 'y' (ambos a la vez).");
                crearComentario(f2, rocio, "Ahora entendi, gracias a todos!");
            }

            Foro f3 = crearForo("Ejercicios de relaciones binarias", "Alguien tiene ejercicios resueltos de relaciones binarias? Necesito practicar para el parcial.", md, tomas);
            if (f3 != null) {
                crearComentario(f3, florencia, "Yo tengo varios. Podes revisar los apuntes que subi en la seccion de resumenes.");
                crearComentario(f3, diego, "Pro tip: practiquen con matrices de adyacencia para visualizar las relaciones. Ayuda mucho.");
                crearComentario(f3, tomas, "Gracias! Voy a buscar los resumenes de Florencia.");
            }

            Foro f4 = crearForo("Demostraciones por induccion", "Como se arranca una demostracion por induccion? Siempre me trabo en el paso inductivo.", md, martin);
            if (f4 != null) {
                crearComentario(f4, lucia, "Paso 1: caso base (n=1). Paso 2: hipotesis inductiva (vale para n). Paso 3: demostrar que vale para n+1.");
                crearComentario(f4, diego, "Agrego: en el paso inductivo, siempre trata de llegar a la expresion de n+1 usando la hipotesis de n.");
                crearComentario(f4, valentina, "Les comparto una guia de ejercicios de induccion que prepare. La subo al foro.");
                crearComentario(f4, martin, "Mil gracias! Ahora me queda mas claro.");
                crearComentario(f4, juan, "A mi tambien me sirvio, gracias!");
            }

            Foro f5 = crearForo("Teoria de grafos - ejercicios", "Alguien me explica como identificar si un grafo es bipartito?", md, julieta);
            if (f5 != null) {
                crearComentario(f5, diego, "Un grafo es bipartito si se puede colorear con 2 colores sin que vertices adyacentes compartan color.");
                crearComentario(f5, lucia, "Practicamente: hace un BFS/DFS y asigna colores alternados. Si encontris una arista entre dos del mismo color, no es bipartito.");
                crearComentario(f5, camila, "Tip: todos los arboles son bipartitos. Los ciclos impares NO son bipartitos.");
                crearComentario(f5, julieta, "Gracias! Me salvo con el tip de los arboles :)");
            }
        }

        if (so != null) {
            Foro f6 = crearForo("TP Sistemas - consultas sobre la entrega", "Cuando es la fecha limite para entregar el TP? Tambien queria saber si se puede hacer en grupos de 3.", so, juan);
            if (f6 != null) {
                crearComentario(f6, ana, "Segun el cronograma, es hasta el 20 de julio. Y si, se puede en grupos de hasta 4 personas.");
                crearComentario(f6, carlos, "Hola, soy Carlos, tutor de la catedra. Confirmo: fecha limite 20/07, grupos de hasta 4 integrantes. Recuerden usar la bibliografia recomendada.");
                crearComentario(f6, florencia, "Alguien mas quiere armar grupo? Somos 2 y necesitamos 1 o 2 mas.");
                crearComentario(f6, tomas, "Yo me sumo! Pasenme el contacto.");
            }

            Foro f7 = crearForo("Diagramas de flujo - recomendaciones", "Que herramienta recomiendan para hacer diagramas de flujo?", so, leonardo);
            if (f7 != null) {
                crearComentario(f7, carlos, "Draw.io es gratuita y muy completa. Funciona online y se integra con Google Drive.");
                crearComentario(f7, martin, "Yo uso Lucidchart, tiene una version gratuita para estudiantes.");
                crearComentario(f7, facundo, "Recomiendo PlantUML si quieren algo basado en codigo. Genera diagramas desde texto.");
                crearComentario(f7, leonardo, "Gracias! Voy a probar Draw.io.");
            }

            Foro f8 = crearForo("Duda sobre casos de uso", "Como se diferencian los actores primarios de los secundarios en un diagrama de casos de uso?", so, florencia);
            if (f8 != null) {
                crearComentario(f8, carlos, "Actor primario: inicia la interaccion con el sistema. Secundario: provee un servicio al sistema.");
                crearComentario(f8, santiago, "Ejemplo: en un cajero, el cliente es primario (retira dinero) y el banco es secundario (valida la cuenta).");
                crearComentario(f8, facundo, "Exacto. El primario busca un objetivo, el secundario solo responde a una solicitud.");
                crearComentario(f8, florencia, "Clarisimo, gracias!");
            }

            Foro f9 = crearForo("Organizacion empresarial - teorias", "Alguien me recomienda bibliografia para entender la teoria de sistemas?", so, julieta);
            if (f9 != null) {
                crearComentario(f9, santiago, "El libro de 'Sistemas y Organizaciones' de Blejmar es la biblia de la materia.");
                crearComentario(f9, leonardo, "Tambien recomiendo los apuntes de la catedra, estan muy bien resumidos.");
                crearComentario(f9, camila, "Yo tengo un resumen con los conceptos clave. Se los paso si quieren.");
                crearComentario(f9, julieta, "Dale, pasamelo Camila! Gracias.");
            }
        }

        if (alg != null) {
            Foro f10 = crearForo("Duda con estructuras condicionales", "No entiendo cuando usar 'si' anidado vs 'segun'. Alguien me explica?", alg, leonardo);
            if (f10 != null) {
                crearComentario(f10, ana, "'Si' anidado se usa para condiciones que dependen unas de otras. 'Segun' es para multiples opciones mutuamente excluyentes.");
                crearComentario(f10, valentina, "Ejemplo: 'segun' es como un menu de opciones, 'si' anidado es como filtros sucesivos.");
                crearComentario(f10, facundo, "Regla practica: si tenes mas de 3 condiciones encadenadas, considera usar 'segun'.");
                crearComentario(f10, leonardo, "Gracias por la explicacion!");
            }

            Foro f11 = crearForo("Algoritmos de ordenamiento", "Cual es la diferencia entre burbujeo y seleccion? Los dos ordenan pero no entiendo cual es mejor.", alg, juan);
            if (f11 != null) {
                crearComentario(f11, valentina, "Burbujeo compara pares adyacentes y va 'flotando' el mayor. Seleccion busca el minimo y lo coloca al inicio.");
                crearComentario(f11, diego, "En eficiencia son parecidos (O(n^2)), pero seleccion hace menos intercambios.");
                crearComentario(f11, facundo, "Para conjuntos chicos cualquiera sirve. Para grandes usen QuickSort o MergeSort.");
                crearComentario(f11, juan, "Gracias! Me quedo con seleccion entonces.");
                crearComentario(f11, camila, "Igual practica ambos, a veces en los parciales toman cualquiera de los dos.");
            }

            Foro f12 = crearForo("Pseudocodigo a codigo", "Como paso un pseudocodigo a Python? Tengo un ejercicio que no me sale.", alg, rocio);
            if (f12 != null) {
                crearComentario(f12, tomas, "Identifica primero las estructuras: asignaciones, condicionales, ciclos. Luego traducis uno a uno.");
                crearComentario(f12, valentina, "Python tiene sintaxis muy parecida al pseudocodigo. Te va a resultar natural.");
                crearComentario(f12, santiago, "Si queres pasame el ejercicio por privado y te ayudo a traducirlo.");
                crearComentario(f12, rocio, "Dale, ahi te escribo!");
                crearComentario(f12, martin, "A mi tambien me paso al principio. Con practica se hace facil.");
            }

            Foro f13 = crearForo("Busqueda binaria vs secuencial", "Cuando conviene usar busqueda binaria y cuando secuencial?", alg, martin);
            if (f13 != null) {
                crearComentario(f13, diego, "Binaria: datos ORDENADOS y muchas busquedas. Secuencial: datos desordenados o lista chica.");
                crearComentario(f13, valentina, "Binaria es O(log n), secuencial es O(n). Para listas grandes la diferencia es enorme.");
                crearComentario(f13, facundo, "Dato: Java usa busqueda binaria en Collections.binarySearch()");
                crearComentario(f13, martin, "Perfecto, entendido!");
            }
        }

        if (md != null) {
            GrupoEstudio g1 = crearGrupo("Estudio Algebra de Boole", "Grupo para repasar algebra de Boole y preparar el parcial. Resolvemos ejercicios juntos y compartimos material.", md, maria, 5);
            if (g1 != null) { agregarMiembro(g1, juan); agregarMiembro(g1, ana); agregarMiembro(g1, rocio); crearEncuentro(g1, "Repaso general pre-parcial", "Biblioteca central - 2do piso", LocalDateTime.now().plusDays(5), maria); }

            GrupoEstudio g2 = crearGrupo("Algoritmos: Resolviendo juntos", "Resolvemos ejercicios de algoritmos y estructuras de datos. Desde pseudocodigo hasta implementacion.", alg, ana, 4);
            if (g2 != null) { agregarMiembro(g2, juan); agregarMiembro(g2, martin); crearEncuentro(g2, "Meet de consulta semanal", "Google Meet - link por privado", LocalDateTime.now().plusDays(3), ana); }

            GrupoEstudio g3 = crearGrupo("Matematica Discreta - Parcial 2", "Preparamos el segundo parcial de Matematica Discreta. Vemos relaciones, grafos y arboles.", md, juan, 6);
            if (g3 != null) { agregarMiembro(g3, ana); agregarMiembro(g3, maria); agregarMiembro(g3, florencia); crearEncuentro(g3, "Resolucion de parciales anteriores", "Aula 204 - UTN", LocalDateTime.now().plusDays(7), juan); crearEncuentro(g3, "Teoria de grafos en la practica", "Laboratorio de informatica", LocalDateTime.now().plusDays(10), maria); }

            GrupoEstudio g4 = crearGrupo("TP Sistemas y Organizaciones", "Grupo para coordinar la entrega del TP final de Sistemas.", so, maria, 4);
            if (g4 != null) { agregarMiembro(g4, ana); agregarMiembro(g4, juan); agregarMiembro(g4, tomas); crearEncuentro(g4, "Definicion de alcance del TP", "Biblioteca - Sector grupos", LocalDateTime.now().plusDays(2), maria); }

            GrupoEstudio g5 = crearGrupo("Programacion Competitiva", "Practicamos para competencias de programacion. Resolvemos problemas de Codeforces y LeetCode.", alg, carlos, 10);
            if (g5 != null) { agregarMiembro(g5, ana); agregarMiembro(g5, maria); agregarMiembro(g5, juan); agregarMiembro(g5, leonardo); crearEncuentro(g5, "Maraton de programacion semanal", "Labo 3 - Piso 1", LocalDateTime.now().plusDays(1), carlos); }

            GrupoEstudio g6 = crearGrupo("Estudio general - 1er año", "Grupo abierto para estudiantes de 1er año. Compartimos apuntes y organizamos sesiones de estudio.", md, ana, 12);
            if (g6 != null) { agregarMiembro(g6, juan); agregarMiembro(g6, maria); agregarMiembro(g6, rocio); agregarMiembro(g6, julieta); crearEncuentro(g6, "Meet semanal de consultas", "Discord - servidor del grupo", LocalDateTime.now().plusDays(6), ana); crearEncuentro(g6, "Maraton de ejercicios de parcial", "Aula 101", LocalDateTime.now().plusDays(12), juan); }
        }

        GrupoEstudio g7 = crearGrupo("Fisica I - Grupo de estudio", "Preparamos Fisica I juntos. Cineamtica, dinamica y trabajo y energia.", so, lucia, 5);
        if (g7 != null) { agregarMiembro(g7, tomas); agregarMiembro(g7, florencia); agregarMiembro(g7, leonardo); crearEncuentro(g7, "Ejercicios de tiro parabolico", "Aula 105", LocalDateTime.now().plusDays(4), lucia); }

        GrupoEstudio g8 = crearGrupo("Ingles Tecnico - Conversation Club", "Practicamos ingles tecnico con articulos y presentaciones de temas de ingenieria.", md, valentina, 8);
        if (g8 != null) { agregarMiembro(g8, martin); agregarMiembro(g8, julieta); agregarMiembro(g8, rocio); crearEncuentro(g8, "Technical presentation: Machine Learning", "Zoom", LocalDateTime.now().plusDays(8), valentina); }

        GrupoEstudio g9 = crearGrupo("Base de Datos - Proyecto Final", "Grupo para coordinar el proyecto final de Bases de Datos. Modelado, implementacion y documentacion.", alg, camila, 4);
        if (g9 != null) { agregarMiembro(g9, leonardo); agregarMiembro(g9, florencia); crearEncuentro(g9, "Definicion del modelo entidad-relacion", "Biblioteca", LocalDateTime.now().plusDays(3), camila); }

        GrupoEstudio g10 = crearGrupo("Analisis Matematico - Mesa de ayuda", "Resolvemos ejercicios de analisis: limites, derivadas e integrales. Todos los niveles bienvenidos.", so, diego, 8);
        if (g10 != null) { agregarMiembro(g10, martin); agregarMiembro(g10, julieta); agregarMiembro(g10, tomas); agregarMiembro(g10, rocio); crearEncuentro(g10, "Derivadas: regla de la cadena", "Aula 301", LocalDateTime.now().plusDays(2), diego); crearEncuentro(g10, "Integrales definidas e indefinidas", "Aula 301", LocalDateTime.now().plusDays(9), diego); }

        GrupoEstudio g11 = crearGrupo("Quimica General - Pre-final", "Preparamos el final de Quimica General. Repaso de todos los temas del programa.", so, facundo, 6);
        if (g11 != null) { agregarMiembro(g11, ana); crearEncuentro(g11, "Repaso: tabla periodica y enlaces", "Labo de quimica", LocalDateTime.now().plusDays(11), facundo); }

        GrupoEstudio g12 = crearGrupo("Probabilidad y Estadistica", "Grupo para estudiar probabilidad, variables aleatorias y distribuciones.", md, santiago, 5);
        if (g12 != null) { agregarMiembro(g12, juan); agregarMiembro(g12, florencia); crearEncuentro(g12, "Distribuciones de probabilidad", "Aula 202", LocalDateTime.now().plusDays(6), santiago); }

        if (md != null && alg != null) {
            Resumen r1 = crearResumen("Algebra de Boole - Resumen completo", "Leyes, tablas de verdad y ejercicios resueltos paso a paso.", md, juan);
            if (r1 != null && ana != null) crearValoracion(r1, ana, 5, "Excelente resumen, me ayudó mucho a entender el tema.");
            if (r1 != null && juan != null) crearValoracion(r1, juan, 4, "Muy bueno, aunque faltaría un ejemplo mas.");
            if (r1 != null && rocio != null) crearValoracion(r1, rocio, 5, "Me salvo el parcial! Muy claro.");

            Resumen r2 = crearResumen("Apuntes de Algoritmos - Unidad 1 y 2", "Resumen con ejemplos de pseudocodigo, estructuras secuenciales y condicionales.", alg, ana);
            if (r2 != null && juan != null) crearValoracion(r2, juan, 5, "Los ejemplos de pseudocódigo están muy bien explicados.");
            if (r2 != null && ana != null) crearValoracion(r2, ana, 4, "Buen material, hay un error en el ejemplo 3.");
            if (r2 != null && leonardo != null) crearValoracion(r2, leonardo, 5, "Muy completo, lo recomiendo.");

            Resumen r3 = crearResumen("Guia de ejercicios - Relaciones y Grafos", "Ejercicios resueltos de relaciones binarias, grafos y arboles.", md, florencia);
            if (r3 != null && tomas != null) crearValoracion(r3, tomas, 5, "Justo lo que necesitaba para practicar grafos.");
            if (r3 != null && julieta != null) crearValoracion(r3, julieta, 4, "Ayuda mucho tener los ejercicios resueltos paso a paso.");

            Resumen r4 = crearResumen("Estructuras de datos - Resumen visual", "Diagramas y explicaciones de pilas, colas, listas y arboles binarios.", alg, martin);
            if (r4 != null && tomas != null) crearValoracion(r4, tomas, 5, "Los diagramas son excelentes para entender.");
            if (r4 != null && ana != null) crearValoracion(r4, ana, 3, "Faltan ejemplos de implementacion.");

            Resumen r5 = crearResumen("Sistemas Operativos - Conceptos clave", "Procesos, hilos, planificacion y memoria. Resumen para el parcial.", so, leonardo);
            if (r5 != null && florencia != null) crearValoracion(r5, florencia, 5, "Muy buen resumen para repasar antes del parcial.");

            Resumen r6 = crearResumen("Analisis Matematico - Formulario", "Formulas de limites, derivadas, integrales y series.", so, diego);
            if (r6 != null && martin != null) crearValoracion(r6, martin, 4, "Bien completo, aunque le falta la parte de sucesiones.");
        }

        crearMensaje(maria, ana, "Hola Ana! Soy Maria, tutora de Algebra. Vi que preguntaste en el foro. Queres que nos juntemos a repasar?");
        crearMensaje(ana, maria, "Hola Maria! Si, me vendria muy bien. Tengo dudas con los diagramas de Venn.");
        crearMensaje(maria, ana, "Podemos encontrarnos este jueves en la biblioteca a las 15hs.");
        crearMensaje(ana, maria, "Perfecto, nos vemos alli! Muchas gracias.");
        crearMensaje(maria, ana, "Te confirmo que lleve ejercicios extra de conjuntos!");
        crearMensaje(ana, maria, "Genial, llevo mis apuntes tambien.");

        crearMensaje(carlos, juan, "Hola Juan! Soy Carlos, tutor de Algoritmos. Vi tu consulta sobre el TP.");
        crearMensaje(juan, carlos, "Hola Carlos! Gracias por escribirme. Justo estaba con una duda sobre el pseudocodigo del ejercicio 4.");
        crearMensaje(carlos, juan, "Dale, contame cual es exactamente. El de ordenamiento o el de busqueda?");
        crearMensaje(juan, carlos, "El de busqueda binaria. No me queda claro cuando usar 'mientras' en vez de 'para'.");
        crearMensaje(carlos, juan, "En busqueda binaria usamos 'mientras' porque no sabemos cuantas iteraciones vamos a necesitar.");
        crearMensaje(juan, carlos, "Ahora entendi! Muchas gracias Carlos, me re ayudaste.");
        crearMensaje(carlos, juan, "De nada! Suerte con el TP.");

        crearMensaje(maria, juan, "Hola Juan! Te queria consultar si ya viste el material que subi sobre Algebra.");
        crearMensaje(juan, maria, "Hola Maria! Si, lo vi. Me parecio muy claro, sobre todo la parte de simplificacion.");
        crearMensaje(maria, juan, "Me alegra! Si queres practicar mas, tengo ejercicios extra. Te los puedo pasar.");
        crearMensaje(juan, maria, "Dale, acepto! Pasamelos cuando puedas.");

        crearMensaje(lucia, tomas, "Hola Tomas! Soy Lucia, tutora de Matematica Discreta. Necesitas ayuda con algo?");
        crearMensaje(tomas, lucia, "Hola Lucia! Si, tengo dudas con las demostraciones por induccion.");
        crearMensaje(lucia, tomas, "Podemos verlo juntos. Te parece si nos juntamos el viernes?");
        crearMensaje(tomas, lucia, "Dale, el viernes a las 16hs en la biblioteca.");

        crearMensaje(diego, martin, "Martin, vi tu consulta en el foro de grafos. Ya pudiste resolverlo?");
        crearMensaje(martin, diego, "Hola Diego! Si, con los comentarios que me dejaron pude entender. Gracias!");
        crearMensaje(diego, martin, "De nada! Cualquier cosa, sabes donde encontrarme.");

        crearMensaje(valentina, leonardo, "Leonardo, te comparti unos ejercicios de algoritmos por aca. Revisalos cuando puedas.");
        crearMensaje(leonardo, valentina, "Gracias Vale! Ahi los reviso. Te aviso si tengo dudas.");
        crearMensaje(valentina, leonardo, "Dale, cualquier cosa me escribis.");

        crearMensaje(camila, florencia, "Florencia, sumate al grupo de Base de Datos que cree! Vamos a coordinar el proyecto.");
        crearMensaje(florencia, camila, "Dale! Ahi me uno. Tenemos que definir el tema del proyecto.");

        crearMensaje(santiago, julieta, "Julieta, te recomiendo los ejercicios de probabilidad que subi. Son los que suelen tomar en el parcial.");
        crearMensaje(julieta, santiago, "Gracias Santi! Los voy a hacer este fin de semana.");
        crearMensaje(santiago, julieta, "Si queres, podemos corregirlos juntos el lunes.");
        crearMensaje(julieta, santiago, "Me parece bien! Nos vemos el lunes.");
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
