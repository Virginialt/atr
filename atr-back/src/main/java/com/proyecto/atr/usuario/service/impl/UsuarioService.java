package com.proyecto.atr.usuario.service.impl;

import com.proyecto.atr.usuario.dto.UsuarioDTO;
import com.proyecto.atr.usuario.mapper.UsuarioMapper;
import com.proyecto.atr.usuario.model.entity.Usuario;
import com.proyecto.atr.usuario.model.repository.UsuarioRepository;
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
}