package com.atr.atr.Repository;

import com.atr.atr.Model.Foro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForoRepository extends JpaRepository<Foro, Long> {
    List<Foro> findByEstado(Foro.Estado estado);
    List<Foro> findByMateriaIdAndEstado(Long materiaId, Foro.Estado estado);
    List<Foro> findByTituloContainingIgnoreCaseAndEstado(String titulo, Foro.Estado estado);
    List<Foro> findByMateriaIdAndTituloContainingIgnoreCaseAndEstado(Long materiaId, String titulo, Foro.Estado estado);
}
