package com.atr.atr.Controller;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/usuario")
@CrossOrigin(origins = "http://localhost:3000")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
    UsuarioDTO createUsuario = usuarioService.registrarUsuario(usuarioDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createUsuario);
}

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }
};