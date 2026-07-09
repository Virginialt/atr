package com.atr.atr.Controller;

import com.atr.atr.DTO.LoginRequest;
import com.atr.atr.DTO.LoginResponse;
import com.atr.atr.Config.JwtUtil;
import com.atr.atr.Model.Usuario;
import com.atr.atr.Repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${path_mapping}/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail());

        if (usuario == null || !passwordEncoder.matches(request.getPassword(), usuario.getContraseña())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Email o contraseña incorrectos"));
        }

        String token = jwtUtil.generateToken(usuario.getEmail());

        LoginResponse response = new LoginResponse(
            token,
            usuario.getEmail(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getRol().name(),
            usuario.getIdUsuario()
        );

        return ResponseEntity.ok(response);
    }
}
