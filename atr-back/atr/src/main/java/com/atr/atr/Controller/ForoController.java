package com.atr.atr.Controller;

import com.atr.atr.DTO.*;
import com.atr.atr.Service.ForoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${path_mapping}/foros")
public class ForoController {

    @Autowired
    private ForoService foroService;

    @PostMapping
    public ResponseEntity<ForoDto> crearForo(@Valid @RequestBody CrearForoRequest request,
                                              Authentication authentication) {
        ForoDto foro = foroService.crearForo(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(foro);
    }

    @GetMapping
    public ResponseEntity<List<ForoDto>> listarForos(
            @RequestParam(required = false) Long materiaId,
            @RequestParam(required = false) String buscar) {
        return ResponseEntity.ok(foroService.listarForos(materiaId, buscar));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ForoDto> obtenerForo(@PathVariable Long id) {
        return ResponseEntity.ok(foroService.obtenerForo(id));
    }

    @PutMapping("/{id}/cerrar")
    public ResponseEntity<?> cerrarForo(@PathVariable Long id, Authentication authentication) {
        foroService.cerrarForo(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Hilo cerrado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarForo(@PathVariable Long id, Authentication authentication) {
        foroService.eliminarForo(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/comentarios")
    public ResponseEntity<List<ComentarioDto>> listarComentarios(@PathVariable Long id) {
        return ResponseEntity.ok(foroService.listarComentarios(id));
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<ComentarioDto> crearComentario(@PathVariable Long id,
                                                          @Valid @RequestBody CrearComentarioRequest request,
                                                          Authentication authentication) {
        ComentarioDto comentario = foroService.crearComentario(id, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(comentario);
    }

    @DeleteMapping("/comentarios/{comentarioId}")
    public ResponseEntity<Void> eliminarComentario(@PathVariable Long comentarioId,
                                                    Authentication authentication) {
        foroService.eliminarComentario(comentarioId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
