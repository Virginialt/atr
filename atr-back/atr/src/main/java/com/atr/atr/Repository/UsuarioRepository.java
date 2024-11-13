package com.atr.atr.Repository;

import com.atr.atr.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método para buscar usuarios por email
    Usuario findByEmail(String email);
}