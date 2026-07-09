package com.atr.atr.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MateriaDto {

    private Long id;  // ID de la materia

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;  // Nombre de la materia

    @NotNull(message = "El ID del área no puede ser nulo")
    private Long areaId;  // ID del área a la que pertenece

    @NotNull(message = "El año no puede ser nulo")
    private Integer anio;  // Año en el que se cursa la materia

    private Boolean activo;  // Estado de la materia (activo o eliminado)
}
