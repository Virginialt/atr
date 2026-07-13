package com.atr.atr.Controller;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("${path_mapping}/usuario")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO createUsuario = usuarioService.registrarUsuario(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createUsuario);
    }

    @GetMapping
    public ResponseEntity<UsuarioDTO> usuarioActual(Authentication authentication) {
        String email = authentication.getName();
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/tutores")
    public ResponseEntity<List<UsuarioDTO>> obtenerTutores() {
        return ResponseEntity.ok(usuarioService.obtenerTutores());
    }

    @PutMapping
    public ResponseEntity<UsuarioDTO> actualizarPerfil(@RequestBody UsuarioDTO usuarioDTO,
                                                        Authentication authentication) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(usuarioDTO, authentication.getName()));
    }
};