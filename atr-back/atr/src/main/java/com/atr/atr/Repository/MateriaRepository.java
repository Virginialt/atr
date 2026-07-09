package com.atr.atr.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.atr.atr.Model.Materia;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {
    List<Materia> findByEstado(Materia.Estado estado); // Método para listar materias activas
    boolean existsByNombre(String nombre);      // Verificar si una materia existe por nombre
}
