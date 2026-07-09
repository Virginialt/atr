package com.atr.atr.Repository;

import com.atr.atr.Model.ComentarioForo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioForoRepository extends JpaRepository<ComentarioForo, Long> {
    List<ComentarioForo> findByForoIdOrderByCreatedAtAsc(Long foroId);
}
