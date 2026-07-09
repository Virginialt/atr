package com.atr.atr.Service;

import com.atr.atr.DTO.CrearMensajeRequest;
import com.atr.atr.DTO.MensajeDto;
import com.atr.atr.Model.Mensaje;
import com.atr.atr.Model.Usuario;
import com.atr.atr.Repository.MensajeRepository;
import com.atr.atr.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public MensajeDto enviarMensaje(CrearMensajeRequest request, String email) {
        Usuario remitente = usuarioRepository.findByEmail(email);
        Usuario destinatario = usuarioRepository.findById(request.getDestinatarioId())
                .orElseThrow(() -> new RuntimeException("Destinatario no encontrado"));

        Mensaje mensaje = new Mensaje();
        mensaje.setRemitente(remitente);
        mensaje.setDestinatario(destinatario);
        mensaje.setContenido(request.getContenido());
        mensaje = mensajeRepository.save(mensaje);
        return toDto(mensaje);
    }

    @Transactional
    public List<MensajeDto> obtenerConversacion(Long otroUsuarioId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        List<Mensaje> mensajes = mensajeRepository.findConversacion(usuario.getIdUsuario(), otroUsuarioId);

        List<Mensaje> noLeidos = mensajes.stream()
                .filter(m -> m.getDestinatario().getIdUsuario().equals(usuario.getIdUsuario()) && !m.isLeido())
                .collect(Collectors.toList());
        noLeidos.forEach(m -> m.setLeido(true));
        mensajeRepository.saveAll(noLeidos);

        return mensajes.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ContactoDto> obtenerContactos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        List<Usuario> contactos = mensajeRepository.findContactos(usuario.getIdUsuario());

        List<ContactoDto> result = new ArrayList<>();
        for (Usuario contacto : contactos) {
            List<Mensaje> ultimos = mensajeRepository.findUltimoMensaje(usuario.getIdUsuario(), contacto.getIdUsuario());
            Mensaje ultimo = ultimos.isEmpty() ? null : ultimos.get(0);
            long noLeidos = contarNoLeidos(usuario.getIdUsuario(), contacto.getIdUsuario());

            ContactoDto dto = new ContactoDto();
            dto.setUsuarioId(contacto.getIdUsuario());
            dto.setUsuarioNombre(contacto.getNombre() + " " + contacto.getApellido());
            dto.setRol(contacto.getRol().name());
            if (ultimo != null) {
                dto.setUltimoMensaje(ultimo.getContenido());
                dto.setUltimoMensajeTime(ultimo.getCreatedAt());
            }
            dto.setNoLeidos((int) noLeidos);
            result.add(dto);
        }
        return result;
    }

    private long contarNoLeidos(Long userId, Long contactoId) {
        List<Mensaje> todos = mensajeRepository.findConversacion(userId, contactoId);
        return todos.stream().filter(m -> m.getDestinatario().getIdUsuario().equals(userId) && !m.isLeido()).count();
    }

    private MensajeDto toDto(Mensaje m) {
        MensajeDto dto = new MensajeDto();
        dto.setId(m.getId());
        dto.setRemitenteId(m.getRemitente().getIdUsuario());
        dto.setRemitenteNombre(m.getRemitente().getNombre() + " " + m.getRemitente().getApellido());
        dto.setDestinatarioId(m.getDestinatario().getIdUsuario());
        dto.setDestinatarioNombre(m.getDestinatario().getNombre() + " " + m.getDestinatario().getApellido());
        dto.setContenido(m.getContenido());
        dto.setLeido(m.isLeido());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }

    public static class ContactoDto {
        private Long usuarioId;
        private String usuarioNombre;
        private String rol;
        private String ultimoMensaje;
        private LocalDateTime ultimoMensajeTime;
        private int noLeidos;

        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public String getUsuarioNombre() { return usuarioNombre; }
        public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }
        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
        public String getUltimoMensaje() { return ultimoMensaje; }
        public void setUltimoMensaje(String ultimoMensaje) { this.ultimoMensaje = ultimoMensaje; }
        public LocalDateTime getUltimoMensajeTime() { return ultimoMensajeTime; }
        public void setUltimoMensajeTime(LocalDateTime ultimoMensajeTime) { this.ultimoMensajeTime = ultimoMensajeTime; }
        public int getNoLeidos() { return noLeidos; }
        public void setNoLeidos(int noLeidos) { this.noLeidos = noLeidos; }
    }
}
