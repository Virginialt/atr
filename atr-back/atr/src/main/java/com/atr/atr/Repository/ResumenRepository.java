package com.atr.atr.Repository;

import com.atr.atr.Model.Resumen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumenRepository extends JpaRepository<Resumen, Long> {
    List<Resumen> findByEstado(Resumen.Estado estado);
    List<Resumen> findByMateriaIdAndEstado(Long materiaId, Resumen.Estado estado);
    List<Resumen> findByTituloContainingIgnoreCaseAndEstado(String titulo, Resumen.Estado estado);
    List<Resumen> findByMateriaIdAndTituloContainingIgnoreCaseAndEstado(Long materiaId, String titulo, Resumen.Estado estado);
    List<Resumen> findByUsuario_IdUsuarioAndEstado(Long usuarioId, Resumen.Estado estado);
}
