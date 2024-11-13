package com.proyecto.atr.usuario.service;

import com.proyecto.atr.usuario.model.entity.Usuario;

public interface IUsuario {
    
    Usuario save(Usuario usuario);

    Usuario findById(Integer id);

    void delete(Usuario usuario);
}
