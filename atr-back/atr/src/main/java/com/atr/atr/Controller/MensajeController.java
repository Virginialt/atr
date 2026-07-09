package com.atr.atr.Controller;

import com.atr.atr.DTO.CrearMensajeRequest;
import com.atr.atr.DTO.MensajeDto;
import com.atr.atr.Service.MensajeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${path_mapping}/mensajes")
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @PostMapping
    public ResponseEntity<MensajeDto> enviarMensaje(@Valid @RequestBody CrearMensajeRequest request,
                                                     Authentication authentication) {
        MensajeDto mensaje = mensajeService.enviarMensaje(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(mensaje);
    }

    @GetMapping("/contactos")
    public ResponseEntity<List<MensajeService.ContactoDto>> obtenerContactos(Authentication authentication) {
        return ResponseEntity.ok(mensajeService.obtenerContactos(authentication.getName()));
    }

    @GetMapping("/conversacion/{usuarioId}")
    public ResponseEntity<List<MensajeDto>> obtenerConversacion(@PathVariable Long usuarioId,
                                                                 Authentication authentication) {
        return ResponseEntity.ok(mensajeService.obtenerConversacion(usuarioId, authentication.getName()));
    }
}
