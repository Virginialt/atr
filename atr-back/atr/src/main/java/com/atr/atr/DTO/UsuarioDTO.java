package com.atr.atr.DTO;
import com.atr.atr.Model.Usuario.Rol;

public class UsuarioDTO {

    private String nombre;
    private String apellido;
    private String email;
    private String contraseña;
    private Long carreraId;
    private String rol;
    private Integer año;

    // Constructor
    public UsuarioDTO() {
    }

    // Getters y setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public Long getCarreraId() {
        return carreraId;
    }

    public void setCarreraId(Long carreraId) {
        this.carreraId = carreraId;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Integer getAño() {
        return año;
    }

    public void setAño(Integer año) {
        this.año = año;
    }

    public void setRol(Rol rol2) {
        throw new UnsupportedOperationException("Unimplemented method 'setRol'");
    }
}
