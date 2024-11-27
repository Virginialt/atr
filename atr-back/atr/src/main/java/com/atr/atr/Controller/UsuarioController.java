package com.atr.atr.Controller;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.util.List;


@RestController
@RequestMapping("/api/v1/usuario")
@CrossOrigin(origins = "${path_cross}")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

@PostMapping("/registrar")
public ResponseEntity<?> crearUsuario(@RequestBody @Valid UsuarioDTO usuarioDTO, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getAllErrors());
    }
    
    try {
        UsuarioDTO createUsuario = usuarioService.registrarUsuario(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createUsuario);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
    }
}


    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }
}
