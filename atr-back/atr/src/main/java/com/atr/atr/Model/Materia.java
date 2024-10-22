package com.atr.atr.Model;

import java.io.Serializable;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "materias")
public class Materia implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Clave primaria

    @Column(name = "nombre", nullable = false, unique = true)
    @NotBlank(message = "El nombre de la materia no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;  // Nombre de la materia

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    @NotNull(message = "El área no puede ser nula")
    private Area area;  // Relación con el área (una materia pertenece a un área)

    @Column(name = "anio", nullable = false)
    @Min(value = 1, message = "El año debe ser al menos 1")
    @Max(value = 5, message = "El año no puede ser mayor que 5")
    private int anio;  // Año de la materia (puede ser 1 a 5)

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @NotNull(message = "El estado no puede ser nulo")
    private Estado estado;

    public enum Estado {
        ACTIVA,
        ELIMINADA
    }

    public void asEliminar() {
        this.setEstado(Estado.ELIMINADA);
    }

    @PrePersist
    @PreUpdate
    public void normalizeNombre() {
        if (nombre != null) {
            this.nombre = nombre.trim().toLowerCase(); // Eliminar espacios y convertir a minúsculas
        }
    }

        public Boolean isActivo() {
        return this.estado == Estado.ACTIVA;
    }

    public void setActivo(Boolean activo) {
        this.estado = activo ? Estado.ACTIVA : Estado.ELIMINADA;
    }
}
