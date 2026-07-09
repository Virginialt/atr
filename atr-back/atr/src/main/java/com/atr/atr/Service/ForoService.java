package com.atr.atr.Service;

import com.atr.atr.DTO.*;
import com.atr.atr.Model.*;
import com.atr.atr.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForoService {

    @Autowired
    private ForoRepository foroRepository;

    @Autowired
    private ComentarioForoRepository comentarioRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public ForoDto crearForo(CrearForoRequest request, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuario no encontrado");

        Foro foro = new Foro();
        foro.setTitulo(request.getTitulo());
        foro.setContenido(request.getContenido());
        foro.setUsuario(usuario);

        if (request.getMateriaId() != null) {
            Materia materia = materiaRepository.findById(request.getMateriaId())
                .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
            foro.setMateria(materia);
        }

        foro = foroRepository.save(foro);
        return toDto(foro);
    }

    public List<ForoDto> listarForos(Long materiaId, String busqueda) {
        List<Foro> foros;

        if (materiaId != null && busqueda != null && !busqueda.isBlank()) {
            foros = foroRepository.findByMateriaIdAndTituloContainingIgnoreCaseAndEstado(materiaId, busqueda, Foro.Estado.ACTIVO);
        } else if (materiaId != null) {
            foros = foroRepository.findByMateriaIdAndEstado(materiaId, Foro.Estado.ACTIVO);
        } else if (busqueda != null && !busqueda.isBlank()) {
            foros = foroRepository.findByTituloContainingIgnoreCaseAndEstado(busqueda, Foro.Estado.ACTIVO);
        } else {
            foros = foroRepository.findByEstado(Foro.Estado.ACTIVO);
        }

        return foros.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ForoDto obtenerForo(Long id) {
        Foro foro = foroRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Foro no encontrado"));
        return toDto(foro);
    }

    @Transactional
    public void cerrarForo(Long id, String email) {
        Foro foro = foroRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Foro no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (!foro.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("No puedes cerrar un hilo que no te pertenece");
        }
        foro.setEstado(Foro.Estado.CERRADO);
        foroRepository.save(foro);
    }

    @Transactional
    public void eliminarForo(Long id, String email) {
        Foro foro = foroRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Foro no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (!foro.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("No puedes eliminar un hilo que no te pertenece");
        }
        foro.setEstado(Foro.Estado.ELIMINADO);
        foroRepository.save(foro);
    }

    public List<ComentarioDto> listarComentarios(Long foroId) {
        return comentarioRepository.findByForoIdOrderByCreatedAtAsc(foroId)
            .stream().map(this::toComentarioDto).collect(Collectors.toList());
    }

    @Transactional
    public ComentarioDto crearComentario(Long foroId, CrearComentarioRequest request, String email) {
        Foro foro = foroRepository.findById(foroId)
            .orElseThrow(() -> new RuntimeException("Foro no encontrado"));
        if (foro.getEstado() != Foro.Estado.ACTIVO) {
            throw new RuntimeException("El hilo está cerrado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuario no encontrado");

        ComentarioForo comentario = new ComentarioForo();
        comentario.setForo(foro);
        comentario.setUsuario(usuario);
        comentario.setContenido(request.getContenido());

        comentario = comentarioRepository.save(comentario);
        return toComentarioDto(comentario);
    }

    @Transactional
    public void eliminarComentario(Long comentarioId, String email) {
        ComentarioForo comentario = comentarioRepository.findById(comentarioId)
            .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (!comentario.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("No puedes eliminar un comentario que no te pertenece");
        }
        comentarioRepository.delete(comentario);
    }

    private ForoDto toDto(Foro foro) {
        ForoDto dto = new ForoDto();
        dto.setId(foro.getId());
        dto.setTitulo(foro.getTitulo());
        dto.setContenido(foro.getContenido());
        dto.setMateriaId(foro.getMateria() != null ? foro.getMateria().getId() : null);
        dto.setMateriaNombre(foro.getMateria() != null ? foro.getMateria().getNombre() : null);
        dto.setUsuarioId(foro.getUsuario().getIdUsuario());
        dto.setUsuarioNombre(foro.getUsuario().getNombre() + " " + foro.getUsuario().getApellido());
        dto.setCantidadComentarios(comentarioRepository.findByForoIdOrderByCreatedAtAsc(foro.getId()).size());
        dto.setEstado(foro.getEstado().name());
        dto.setCreatedAt(foro.getCreatedAt());
        return dto;
    }

    private ComentarioDto toComentarioDto(ComentarioForo comentario) {
        ComentarioDto dto = new ComentarioDto();
        dto.setId(comentario.getId());
        dto.setContenido(comentario.getContenido());
        dto.setUsuarioId(comentario.getUsuario().getIdUsuario());
        dto.setUsuarioNombre(comentario.getUsuario().getNombre() + " " + comentario.getUsuario().getApellido());
        dto.setCreatedAt(comentario.getCreatedAt());
        return dto;
    }
}
