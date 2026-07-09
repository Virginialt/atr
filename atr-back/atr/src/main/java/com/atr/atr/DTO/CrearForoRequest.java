package com.atr.atr.DTO;

import jakarta.validation.constraints.NotBlank;

public class CrearForoRequest {

    @NotBlank
    private String titulo;

    @NotBlank
    private String contenido;

    private Long materiaId;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
}
