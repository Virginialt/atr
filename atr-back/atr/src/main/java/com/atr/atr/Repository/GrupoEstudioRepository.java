package com.atr.atr.Repository;

import com.atr.atr.Model.GrupoEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrupoEstudioRepository extends JpaRepository<GrupoEstudio, Long> {
    List<GrupoEstudio> findByEstado(GrupoEstudio.Estado estado);
    List<GrupoEstudio> findByMateriaIdAndEstado(Long materiaId, GrupoEstudio.Estado estado);
}
