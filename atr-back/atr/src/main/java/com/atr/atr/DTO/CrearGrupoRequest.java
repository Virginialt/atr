package com.atr.atr.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CrearGrupoRequest {

    @NotBlank
    private String nombre;

    private String descripcion;

    private Long materiaId;

    @Min(2)
    private Integer maxIntegrantes;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }

    public Integer getMaxIntegrantes() { return maxIntegrantes; }
    public void setMaxIntegrantes(Integer maxIntegrantes) { this.maxIntegrantes = maxIntegrantes; }
}
