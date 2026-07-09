package com.atr.atr.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class GrupoEstudioDto {

    private Long id;
    private String nombre;
    private String descripcion;
    private Long materiaId;
    private String materiaNombre;
    private Long creadorId;
    private String creadorNombre;
    private Integer maxIntegrantes;
    private int cantidadMiembros;
    private boolean esMiembro;
    private String estado;
    private LocalDateTime createdAt;
    private List<MiembroDto> miembros;
    private List<EncuentroDto> encuentros;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }

    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }

    public Long getCreadorId() { return creadorId; }
    public void setCreadorId(Long creadorId) { this.creadorId = creadorId; }

    public String getCreadorNombre() { return creadorNombre; }
    public void setCreadorNombre(String creadorNombre) { this.creadorNombre = creadorNombre; }

    public Integer getMaxIntegrantes() { return maxIntegrantes; }
    public void setMaxIntegrantes(Integer maxIntegrantes) { this.maxIntegrantes = maxIntegrantes; }

    public int getCantidadMiembros() { return cantidadMiembros; }
    public void setCantidadMiembros(int cantidadMiembros) { this.cantidadMiembros = cantidadMiembros; }

    public boolean isEsMiembro() { return esMiembro; }
    public void setEsMiembro(boolean esMiembro) { this.esMiembro = esMiembro; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<MiembroDto> getMiembros() { return miembros; }
    public void setMiembros(List<MiembroDto> miembros) { this.miembros = miembros; }

    public List<EncuentroDto> getEncuentros() { return encuentros; }
    public void setEncuentros(List<EncuentroDto> encuentros) { this.encuentros = encuentros; }
}
