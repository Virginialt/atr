package com.atr.atr.Controller;

import com.atr.atr.DTO.*;
import com.atr.atr.Service.GrupoEstudioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${path_mapping}/grupos")
public class GrupoEstudioController {

    @Autowired
    private GrupoEstudioService grupoService;

    @PostMapping
    public ResponseEntity<GrupoEstudioDto> crearGrupo(@Valid @RequestBody CrearGrupoRequest request,
                                                       Authentication authentication) {
        GrupoEstudioDto grupo = grupoService.crearGrupo(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(grupo);
    }

    @GetMapping
    public ResponseEntity<List<GrupoEstudioDto>> listarGrupos(
            @RequestParam(required = false) Long materiaId,
            @RequestParam(required = false) Long usuarioId,
            Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(grupoService.listarGrupos(materiaId, usuarioId, email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrupoEstudioDto> obtenerGrupo(@PathVariable Long id,
                                                          Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(grupoService.obtenerGrupo(id, email));
    }

    @PostMapping("/{id}/unirse")
    public ResponseEntity<?> unirse(@PathVariable Long id, Authentication authentication) {
        grupoService.unirse(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Te uniste al grupo"));
    }

    @PostMapping("/{id}/salir")
    public ResponseEntity<?> salir(@PathVariable Long id, Authentication authentication) {
        grupoService.salir(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Saliste del grupo"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarGrupo(@PathVariable Long id, Authentication authentication) {
        grupoService.eliminarGrupo(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/encuentros")
    public ResponseEntity<List<EncuentroDto>> listarEncuentros(@PathVariable Long id) {
        return ResponseEntity.ok(grupoService.listarEncuentros(id));
    }

    @PostMapping("/{id}/encuentros")
    public ResponseEntity<EncuentroDto> crearEncuentro(@PathVariable Long id,
                                                        @Valid @RequestBody CrearEncuentroRequest request,
                                                        Authentication authentication) {
        EncuentroDto encuentro = grupoService.crearEncuentro(id, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(encuentro);
    }

    @DeleteMapping("/encuentros/{encuentroId}")
    public ResponseEntity<Void> eliminarEncuentro(@PathVariable Long encuentroId,
                                                   Authentication authentication) {
        grupoService.eliminarEncuentro(encuentroId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
