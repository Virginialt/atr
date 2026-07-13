package com.atr.atr.Repository;

import com.atr.atr.Model.GrupoEstudioMiembro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrupoEstudioMiembroRepository extends JpaRepository<GrupoEstudioMiembro, Long> {
    List<GrupoEstudioMiembro> findByGrupoId(Long grupoId);
    
    List<GrupoEstudioMiembro> findByUsuario_IdUsuario(Long usuarioId);

    @Query("SELECT gem FROM GrupoEstudioMiembro gem WHERE gem.grupo.id = :grupoId AND gem.usuario.idUsuario = :usuarioId")
    Optional<GrupoEstudioMiembro> findByGrupoIdAndUsuarioId(@Param("grupoId") Long grupoId, @Param("usuarioId") Long usuarioId);
    
    int countByGrupoId(Long grupoId);
    
    @Query("SELECT COUNT(gem) > 0 FROM GrupoEstudioMiembro gem WHERE gem.grupo.id = :grupoId AND gem.usuario.idUsuario = :usuarioId")
    boolean existsByGrupoIdAndUsuarioId(@Param("grupoId") Long grupoId, @Param("usuarioId") Long usuarioId);
}
