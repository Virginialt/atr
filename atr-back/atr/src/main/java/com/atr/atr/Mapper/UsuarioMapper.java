package com.atr.atr.Mapper;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Model.Usuario;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UsuarioMapper {

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public static Usuario toEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setEmail(dto.getEmail());
        usuario.setContraseña(passwordEncoder.encode(dto.getContraseña())); // Encriptar contraseña
        usuario.setCarreraId(dto.getCarreraId());
        usuario.setRol(Usuario.Rol.valueOf(dto.getRol()));
        usuario.setAño(dto.getAño());
        return usuario;
    }
    public static UsuarioDTO toDto(Usuario entity) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entity.getIdUsuario());
        dto.setNombre(entity.getNombre());
        dto.setEmail(entity.getEmail());
        dto.setApellido(entity.getApellido());
        dto.setCarreraId(entity.getCarreraId());;
        dto.setRol(entity.getRol().name());
        dto.setAño(entity.getAño());
        return dto;
    }
}
