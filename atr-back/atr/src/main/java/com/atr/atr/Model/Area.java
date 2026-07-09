package com.atr.atr.Model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "areas")
public class Area implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Clave primaria

    @Column(name = "nombre", nullable = false, unique = true)
    @NotBlank(message = "El nombre del área no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;  // Nombre del área (carrera o departamento)

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel", nullable = false)
    @NotNull(message = "El nivel no puede ser nulo")
    private Nivel nivel;  // El nivel puede ser 'GRADO' o 'PREGRADO'

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "area_materias",
        joinColumns = @JoinColumn(name = "area_id"),
        inverseJoinColumns = @JoinColumn(name = "materia_id")
    )
    private List<Materia> materias;  // Lista de materias correspondientes a esta área

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

    public enum Nivel {
        GRADO,
        PREGRADO
    }

    public Boolean isActivo() {
        return this.estado == Estado.ACTIVA;
    }

    public void setActivo(Boolean activo) {
        this.estado = activo ? Estado.ACTIVA : Estado.ELIMINADA;
    }
}
