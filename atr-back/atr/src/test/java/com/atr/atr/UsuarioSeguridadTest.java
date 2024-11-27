package com.atr.atr;

import com.atr.atr.DTO.UsuarioDTO;
import com.atr.atr.Repository.UsuarioRepository;
import com.atr.atr.Service.UsuarioService;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UsuarioSeguridadTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidacionEntradaUsuario() {
        // Test de validación de entrada
        UsuarioDTO usuarioMalicioso = new UsuarioDTO();
        usuarioMalicioso.setNombre("<script>alert('XSS')</script>");
        usuarioMalicioso.setEmail("usuario@ejemplo.com' OR 1=1 --");
        usuarioMalicioso.setContraseña("passwordCorta");

        Set<ConstraintViolation<UsuarioDTO>> violations = validator.validate(usuarioMalicioso);
        assertFalse(violations.isEmpty(), "Debe rechazar entradas maliciosas");
    }

    @Test
    public void testPoliticaContraseña() {
        assertFalse(esContraseñaSegura("123456"), "Contraseña muy débil");
        assertFalse(esContraseñaSegura("password"), "Contraseña predecible");
        assertTrue(esContraseñaSegura("C0mpl3x@Passw0rd!"), "Contraseña segura");
    }

    private boolean esContraseñaSegura(String contraseña) {
        return contraseña.length() >= 8 &&
               contraseña.matches(".*[A-Z].*") &&
               contraseña.matches(".*[a-z].*") &&
               contraseña.matches(".*\\d.*") &&
               contraseña.matches(".*[!@#$%^&*()].*");
    }

    @Test
    public void testNoExponeInfoSensible() {
        // Crear un usuario con todos los campos necesarios
        UsuarioDTO usuario = new UsuarioDTO(
            "Test", // nombre
            "Usuario", // apellido
            "test@ejemplo.com", // email
            "Password123!", // contraseña
            1L, // carreraId
            "ESTUDIANTE", // rol
            2023 // año
        );
        
        // Registrar el usuario
        UsuarioDTO registrado = usuarioService.registrarUsuario(usuario);
        
        // Obtener lista de usuarios
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodosLosUsuarios();
        
        // Verificar que no se expongan contraseñas
        usuarios.forEach(u -> {
            assertNull(u.getContraseña(), "No debe exponer contraseñas");
        });
    }

    @Test
    public void testPreversionInyeccionSQL() {
        String emailMalicioso = "usuario@ejemplo.com' OR '1'='1";
        
        assertDoesNotThrow(() -> {
            usuarioRepository.findByEmail(emailMalicioso);
        }, "Debe manejar entradas potencialmente maliciosas");
    }

    @Test
    public void testValidacionRoles() {
        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setRol("ROL_INVALIDO");
        
        Set<ConstraintViolation<UsuarioDTO>> violations = validator.validate(usuario);
        assertFalse(violations.isEmpty(), "Debe rechazar roles inválidos");
    }
    

}