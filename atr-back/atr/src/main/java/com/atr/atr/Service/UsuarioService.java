package com.atr.atr.Service;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Mapper.UsuarioMapper;
import com.atr.atr.Model.Usuario;
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
}