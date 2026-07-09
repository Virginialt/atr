package com.atr.atr.DTO;

public class LoginResponse {

    private String token;
    private String email;
    private String nombre;
    private String apellido;
    private String rol;
    private Long id;

    public LoginResponse(String token, String email, String nombre, String apellido, String rol, Long id) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rol = rol;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getRol() {
        return rol;
    }

    public Long getId() {
        return id;
    }
}
