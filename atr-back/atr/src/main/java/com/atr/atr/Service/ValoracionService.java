package com.atr.atr.Service;

import com.atr.atr.DTO.ValoracionDto;
import com.atr.atr.Model.Resumen;
import com.atr.atr.Model.Usuario;
import com.atr.atr.Model.Valoracion;
import com.atr.atr.Repository.ResumenRepository;
import com.atr.atr.Repository.UsuarioRepository;
import com.atr.atr.Repository.ValoracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ValoracionService {

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private ResumenRepository resumenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public void valorar(Long resumenId, int puntuacion, String comentario, String email) {
        Resumen resumen = resumenRepository.findById(resumenId)
            .orElseThrow(() -> new RuntimeException("Resumen no encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        LocalDateTime ahora = LocalDateTime.now();

        Optional<Valoracion> existente = valoracionRepository.findByResumenIdAndUsuarioId(resumenId, usuario.getIdUsuario());
        if (existente.isPresent()) {
            Valoracion v = existente.get();
            v.setPuntuacion(puntuacion);
            if (comentario != null) v.setComentario(comentario);
            v.setCreatedAt(ahora);
            valoracionRepository.save(v);
        } else {
            Valoracion valoracion = new Valoracion();
            valoracion.setResumen(resumen);
            valoracion.setUsuario(usuario);
            valoracion.setPuntuacion(puntuacion);
            valoracion.setComentario(comentario);
            valoracion.setCreatedAt(ahora);
            valoracionRepository.save(valoracion);
        }

        Double promedio = valoracionRepository.promedioPorResumenId(resumenId);
        if (promedio != null) {
            resumen.setValoracionPromedio(Math.round(promedio * 10.0) / 10.0);
            resumenRepository.save(resumen);
        }
    }

    public List<ValoracionDto> obtenerValoraciones(Long resumenId) {
        return valoracionRepository.findByResumenId(resumenId).stream().map(v -> {
            ValoracionDto dto = new ValoracionDto();
            dto.setId(v.getId());
            dto.setPuntuacion(v.getPuntuacion());
            dto.setComentario(v.getComentario());
            dto.setUsuarioId(v.getUsuario().getIdUsuario());
            dto.setUsuarioNombre(v.getUsuario().getNombre() + " " + v.getUsuario().getApellido());
            dto.setCreatedAt(v.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }
}
