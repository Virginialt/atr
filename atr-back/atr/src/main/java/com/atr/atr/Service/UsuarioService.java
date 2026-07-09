package com.atr.atr.Service;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Mapper.UsuarioMapper;
import com.atr.atr.Model.Usuario;
import com.atr.atr.Model.Usuario.Rol;
import com.atr.atr.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioDTO registrarUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = UsuarioMapper.toEntity(usuarioDTO);
        usuario = usuarioRepository.save(usuario);
        return UsuarioMapper.toDto(usuario);
    }

    public List<UsuarioDTO> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll()
                                .stream()
                                .map(UsuarioMapper::toDto)
                                .collect(Collectors.toList());
    }

    public List<UsuarioDTO> obtenerTutores() {
        return usuarioRepository.findByRol(Rol.TUTOR)
                .stream()
                .map(UsuarioMapper::toDto)
                .collect(Collectors.toList());
    }

    public UsuarioDTO obtenerUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado con email: " + email);
        }
        return UsuarioMapper.toDto(usuario);
    }
}