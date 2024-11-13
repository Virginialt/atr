package com.proyecto.atr.usuario.model.repository;

import com.proyecto.atr.usuario.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método para buscar usuarios por email
    Usuario findByEmail(String email);
}