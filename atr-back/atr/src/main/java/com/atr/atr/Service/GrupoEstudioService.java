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
public class GrupoEstudioService {

    @Autowired
    private GrupoEstudioRepository grupoRepository;

    @Autowired
    private GrupoEstudioMiembroRepository miembroRepository;

    @Autowired
    private EncuentroRepository encuentroRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public GrupoEstudioDto crearGrupo(CrearGrupoRequest request, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuario no encontrado");

        GrupoEstudio grupo = new GrupoEstudio();
        grupo.setNombre(request.getNombre());
        grupo.setDescripcion(request.getDescripcion());
        grupo.setCreador(usuario);
        grupo.setMaxIntegrantes(request.getMaxIntegrantes());

        if (request.getMateriaId() != null) {
            Materia materia = materiaRepository.findById(request.getMateriaId())
                .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
            grupo.setMateria(materia);
        }

        grupo = grupoRepository.save(grupo);

        GrupoEstudioMiembro miembro = new GrupoEstudioMiembro();
        miembro.setGrupo(grupo);
        miembro.setUsuario(usuario);
        miembroRepository.save(miembro);

        return toDto(grupo, email);
    }

    public List<GrupoEstudioDto> listarGrupos(Long materiaId, String email) {
        List<GrupoEstudio> grupos;
        if (materiaId != null) {
            grupos = grupoRepository.findByMateriaIdAndEstado(materiaId, GrupoEstudio.Estado.ACTIVO);
        } else {
            grupos = grupoRepository.findByEstado(GrupoEstudio.Estado.ACTIVO);
        }
        return grupos.stream().map(g -> toDto(g, email)).collect(Collectors.toList());
    }

    public GrupoEstudioDto obtenerGrupo(Long id, String email) {
        GrupoEstudio grupo = grupoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));
        return toDetalleDto(grupo, email);
    }

    @Transactional
    public void unirse(Long grupoId, String email) {
        GrupoEstudio grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuario no encontrado");

        if (miembroRepository.existsByGrupoIdAndUsuarioId(grupoId, usuario.getIdUsuario())) {
            throw new RuntimeException("Ya sos miembro de este grupo");
        }

        int actuales = miembroRepository.countByGrupoId(grupoId);
        if (grupo.getMaxIntegrantes() != null && actuales >= grupo.getMaxIntegrantes()) {
            throw new RuntimeException("El grupo alcanzó el máximo de integrantes");
        }

        GrupoEstudioMiembro miembro = new GrupoEstudioMiembro();
        miembro.setGrupo(grupo);
        miembro.setUsuario(usuario);
        miembroRepository.save(miembro);
    }

    @Transactional
    public void salir(Long grupoId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuario no encontrado");

        GrupoEstudio grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        if (grupo.getCreador().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("El creador no puede salirse del grupo. Podés eliminarlo.");
        }

        GrupoEstudioMiembro miembro = miembroRepository.findByGrupoIdAndUsuarioId(grupoId, usuario.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("No sos miembro de este grupo"));
        miembroRepository.delete(miembro);
    }

    @Transactional
    public void eliminarGrupo(Long grupoId, String email) {
        GrupoEstudio grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (!grupo.getCreador().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("Solo el creador puede eliminar el grupo");
        }

        grupo.setEstado(GrupoEstudio.Estado.ELIMINADO);
        grupoRepository.save(grupo);
    }

    @Transactional
    public EncuentroDto crearEncuentro(Long grupoId, CrearEncuentroRequest request, String email) {
        GrupoEstudio grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (!miembroRepository.existsByGrupoIdAndUsuarioId(grupoId, usuario.getIdUsuario())) {
            throw new RuntimeException("No sos miembro de este grupo");
        }

        Encuentro encuentro = new Encuentro();
        encuentro.setGrupo(grupo);
        encuentro.setTitulo(request.getTitulo());
        encuentro.setDescripcion(request.getDescripcion());
        encuentro.setUbicacion(request.getUbicacion());
        encuentro.setFechaHora(request.getFechaHora());
        encuentro.setCreador(usuario);

        encuentro = encuentroRepository.save(encuentro);
        return toEncuentroDto(encuentro);
    }

    public List<EncuentroDto> listarEncuentros(Long grupoId) {
        return encuentroRepository.findByGrupoIdOrderByFechaHoraAsc(grupoId)
            .stream().map(this::toEncuentroDto).collect(Collectors.toList());
    }

    @Transactional
    public void eliminarEncuentro(Long encuentroId, String email) {
        Encuentro encuentro = encuentroRepository.findById(encuentroId)
            .orElseThrow(() -> new RuntimeException("Encuentro no encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (!encuentro.getCreador().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("Solo el creador puede eliminar este encuentro");
        }

        encuentroRepository.delete(encuentro);
    }

    private GrupoEstudioDto toDto(GrupoEstudio grupo, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        Long userId = usuario != null ? usuario.getIdUsuario() : null;

        GrupoEstudioDto dto = new GrupoEstudioDto();
        dto.setId(grupo.getId());
        dto.setNombre(grupo.getNombre());
        dto.setDescripcion(grupo.getDescripcion());
        dto.setMateriaId(grupo.getMateria() != null ? grupo.getMateria().getId() : null);
        dto.setMateriaNombre(grupo.getMateria() != null ? grupo.getMateria().getNombre() : null);
        dto.setCreadorId(grupo.getCreador().getIdUsuario());
        dto.setCreadorNombre(grupo.getCreador().getNombre() + " " + grupo.getCreador().getApellido());
        dto.setMaxIntegrantes(grupo.getMaxIntegrantes());
        dto.setCantidadMiembros(miembroRepository.countByGrupoId(grupo.getId()));
        dto.setEsMiembro(userId != null && miembroRepository.existsByGrupoIdAndUsuarioId(grupo.getId(), userId));
        dto.setEstado(grupo.getEstado().name());
        dto.setCreatedAt(grupo.getCreatedAt());
        return dto;
    }

    private GrupoEstudioDto toDetalleDto(GrupoEstudio grupo, String email) {
        GrupoEstudioDto dto = toDto(grupo, email);

        List<MiembroDto> miembros = miembroRepository.findByGrupoId(grupo.getId()).stream()
            .map(m -> {
                MiembroDto md = new MiembroDto();
                md.setId(m.getId());
                md.setUsuarioId(m.getUsuario().getIdUsuario());
                md.setUsuarioNombre(m.getUsuario().getNombre() + " " + m.getUsuario().getApellido());
                md.setFechaUnion(m.getFechaUnion());
                return md;
            }).collect(Collectors.toList());
        dto.setMiembros(miembros);

        List<EncuentroDto> encuentros = encuentroRepository.findByGrupoIdOrderByFechaHoraAsc(grupo.getId()).stream()
            .map(this::toEncuentroDto).collect(Collectors.toList());
        dto.setEncuentros(encuentros);

        return dto;
    }

    private EncuentroDto toEncuentroDto(Encuentro encuentro) {
        EncuentroDto dto = new EncuentroDto();
        dto.setId(encuentro.getId());
        dto.setTitulo(encuentro.getTitulo());
        dto.setDescripcion(encuentro.getDescripcion());
        dto.setUbicacion(encuentro.getUbicacion());
        dto.setFechaHora(encuentro.getFechaHora());
        dto.setCreadorId(encuentro.getCreador().getIdUsuario());
        dto.setCreadorNombre(encuentro.getCreador().getNombre() + " " + encuentro.getCreador().getApellido());
        dto.setCreatedAt(encuentro.getCreatedAt());
        return dto;
    }
}
