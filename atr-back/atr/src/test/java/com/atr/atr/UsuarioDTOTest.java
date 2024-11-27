package com.atr.atr;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertFalse;
import com.atr.atr.DTO.UsuarioDTO;

public class UsuarioDTOTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testUsuarioDTOValidations() {
        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setNombre(""); // Invalid, blank
        usuario.setApellido(""); // Invalid, blank
        usuario.setEmail("invalidemail"); // Invalid email
        usuario.setContraseña(""); // Invalid, blank
        usuario.setCarreraId(null); // Invalid, null
        usuario.setRol(""); // Invalid, blank

        var violations = validator.validate(usuario);

        assertFalse(violations.isEmpty());
    }
}
