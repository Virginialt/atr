package com.atr.atr.Service;

import com.atr.atr.DTO.CrearResumenRequest;
import com.atr.atr.DTO.ResumenDto;
import com.atr.atr.Model.Materia;
import com.atr.atr.Model.Resumen;
import com.atr.atr.Model.Usuario;
import com.atr.atr.Repository.MateriaRepository;
import com.atr.atr.Repository.ResumenRepository;
import com.atr.atr.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResumenService {

    @Autowired
    private ResumenRepository resumenRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads: " + uploadDir);
        }
    }

    @Transactional
    public ResumenDto crearResumen(MultipartFile file, CrearResumenRequest request, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        Materia materia = materiaRepository.findById(request.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));

        String archivoUrl = guardarArchivo(file);

        Resumen resumen = new Resumen();
        resumen.setTitulo(request.getTitulo());
        resumen.setDescripcion(request.getDescripcion());
        resumen.setArchivoUrl(archivoUrl);
        resumen.setMateria(materia);
        resumen.setUsuario(usuario);

        resumen = resumenRepository.save(resumen);
        return toDto(resumen);
    }

    public List<ResumenDto> listarResumenes(Long materiaId, String busqueda, Long usuarioId) {
        List<Resumen> resumenes;

        if (usuarioId != null) {
            resumenes = resumenRepository.findByUsuario_IdUsuarioAndEstado(usuarioId, Resumen.Estado.ACTIVO);
        } else if (materiaId != null && busqueda != null && !busqueda.isBlank()) {
            resumenes = resumenRepository.findByMateriaIdAndTituloContainingIgnoreCaseAndEstado(
                materiaId, busqueda, Resumen.Estado.ACTIVO);
        } else if (materiaId != null) {
            resumenes = resumenRepository.findByMateriaIdAndEstado(materiaId, Resumen.Estado.ACTIVO);
        } else if (busqueda != null && !busqueda.isBlank()) {
            resumenes = resumenRepository.findByTituloContainingIgnoreCaseAndEstado(busqueda, Resumen.Estado.ACTIVO);
        } else {
            resumenes = resumenRepository.findByEstado(Resumen.Estado.ACTIVO);
        }

        return resumenes.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ResumenDto obtenerResumen(Long id) {
        Resumen resumen = resumenRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resumen no encontrado"));
        return toDto(resumen);
    }

    @Transactional
    public ResumenDto actualizarResumen(Long id, MultipartFile file, String titulo, String descripcion, Long materiaId, String email) {
        Resumen resumen = resumenRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resumen no encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (!resumen.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("No puedes editar un resumen que no te pertenece");
        }

        if (titulo != null) resumen.setTitulo(titulo);
        if (descripcion != null) resumen.setDescripcion(descripcion);
        if (materiaId != null) {
            Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
            resumen.setMateria(materia);
        }
        if (file != null && !file.isEmpty()) {
            resumen.setArchivoUrl(guardarArchivo(file));
        }

        resumen = resumenRepository.save(resumen);
        return toDto(resumen);
    }

    @Transactional
    public void eliminarResumen(Long id, String email) {
        Resumen resumen = resumenRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resumen no encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (!resumen.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("No puedes eliminar un resumen que no te pertenece");
        }

        resumen.setEstado(Resumen.Estado.ELIMINADO);
        resumenRepository.save(resumen);
    }

    private String guardarArchivo(MultipartFile file) {
        String nombreOriginal = file.getOriginalFilename();
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        }
        String nombreUnico = UUID.randomUUID().toString() + extension;

        try {
            Path rutaDestino = uploadPath.resolve(nombreUnico);
            Files.copy(file.getInputStream(), rutaDestino);
            return nombreUnico;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + e.getMessage());
        }
    }

    private ResumenDto toDto(Resumen resumen) {
        ResumenDto dto = new ResumenDto();
        dto.setId(resumen.getId());
        dto.setTitulo(resumen.getTitulo());
        dto.setDescripcion(resumen.getDescripcion());
        dto.setArchivoUrl(resumen.getArchivoUrl());
        dto.setMateriaId(resumen.getMateria() != null ? resumen.getMateria().getId() : null);
        dto.setMateriaNombre(resumen.getMateria() != null ? resumen.getMateria().getNombre() : null);
        dto.setUsuarioId(resumen.getUsuario().getIdUsuario());
        dto.setUsuarioNombre(resumen.getUsuario().getNombre() + " " + resumen.getUsuario().getApellido());
        dto.setValoracionPromedio(resumen.getValoracionPromedio());
        dto.setCreatedAt(resumen.getCreatedAt());
        return dto;
    }
}
