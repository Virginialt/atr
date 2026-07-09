package com.atr.atr.Repository;

import com.atr.atr.Model.Usuario;
import com.atr.atr.Model.Usuario.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
    List<Usuario> findByRol(Rol rol);
}