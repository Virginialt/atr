package com.atr.atr.Repository;

import com.atr.atr.Model.Encuentro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncuentroRepository extends JpaRepository<Encuentro, Long> {
    List<Encuentro> findByGrupoIdOrderByFechaHoraAsc(Long grupoId);
}
