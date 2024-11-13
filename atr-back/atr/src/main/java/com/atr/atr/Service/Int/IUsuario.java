package com.atr.atr.Service.Int;

import com.atr.atr.Model.Usuario;

public interface IUsuario {
    
    Usuario save(Usuario usuario);

    Usuario findById(Integer id);

    void delete(Usuario usuario);
}
