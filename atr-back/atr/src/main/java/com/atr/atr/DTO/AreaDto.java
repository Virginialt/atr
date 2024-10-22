package com.atr.atr.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AreaDto {

    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;  // Nombre del área

    @NotBlank(message = "El nivel no puede estar vacío")
    private String nivel;   // Nivel (grado o pregrado)

    private Boolean activo;  // Estado del área (activo o eliminado)

    // Métodos manuales (opcional, Lombok genera esto automáticamente)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    @Override
    public String toString() {
        return "AreaDto{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", nivel='" + nivel + '\'' +
                ", activo=" + activo +
                '}';
    }
}
