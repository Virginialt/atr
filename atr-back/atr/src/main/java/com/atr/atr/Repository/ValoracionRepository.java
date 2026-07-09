package com.atr.atr.Repository;

import com.atr.atr.Model.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {
    @Query("SELECT v FROM Valoracion v WHERE v.resumen.id = :resumenId AND v.usuario.idUsuario = :usuarioId")
    Optional<Valoracion> findByResumenIdAndUsuarioId(@Param("resumenId") Long resumenId, @Param("usuarioId") Long usuarioId);

    List<Valoracion> findByResumenId(Long resumenId);

    @Query("SELECT AVG(v.puntuacion) FROM Valoracion v WHERE v.resumen.id = ?1")
    Double promedioPorResumenId(Long resumenId);

    int countByResumenId(Long resumenId);
}
