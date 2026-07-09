package com.atr.atr.DTO;

import jakarta.validation.constraints.NotBlank;

public class CrearComentarioRequest {

    @NotBlank
    private String contenido;

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
}
