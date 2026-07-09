package com.atr.atr.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.atr.atr.Model.Area;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    List<Area> findByEstado(Area.Estado estado); // Método para listar áreas activas
    boolean existsByNombre(String nombre);        // Verificar si un área existe por nombre
}

