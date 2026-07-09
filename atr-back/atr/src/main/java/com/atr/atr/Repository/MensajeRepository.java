package com.atr.atr.Repository;

import com.atr.atr.Model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    @Query("SELECT m FROM Mensaje m WHERE (m.remitente.idUsuario = :userId1 AND m.destinatario.idUsuario = :userId2) OR (m.remitente.idUsuario = :userId2 AND m.destinatario.idUsuario = :userId1) ORDER BY m.createdAt ASC")
    List<Mensaje> findConversacion(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT DISTINCT m.remitente FROM Mensaje m WHERE m.destinatario.idUsuario = :userId UNION SELECT DISTINCT m.destinatario FROM Mensaje m WHERE m.remitente.idUsuario = :userId")
    List<com.atr.atr.Model.Usuario> findContactos(@Param("userId") Long userId);

    @Query("SELECT m FROM Mensaje m WHERE m.destinatario.idUsuario = :userId AND m.leido = false ORDER BY m.createdAt DESC")
    List<Mensaje> findNoLeidos(@Param("userId") Long userId);

    @Query("SELECT m FROM Mensaje m WHERE (m.remitente.idUsuario = :userId1 AND m.destinatario.idUsuario = :userId2) OR (m.remitente.idUsuario = :userId2 AND m.destinatario.idUsuario = :userId1) ORDER BY m.createdAt DESC")
    List<Mensaje> findUltimoMensaje(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
