package com.atr.atr.Controller;

import com.atr.atr.DTO.ValoracionDto;
import com.atr.atr.DTO.ValoracionRequest;
import com.atr.atr.Service.ValoracionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${path_mapping}/resumenes")
public class ValoracionController {

    @Autowired
    private ValoracionService valoracionService;

    @PostMapping("/{id}/valorar")
    public ResponseEntity<?> valorar(@PathVariable Long id,
                                      @Valid @RequestBody ValoracionRequest request,
                                      Authentication authentication) {
        valoracionService.valorar(id, request.getPuntuacion(), request.getComentario(), authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Valoración registrada"));
    }

    @GetMapping("/{id}/valoraciones")
    public ResponseEntity<List<ValoracionDto>> obtenerValoraciones(@PathVariable Long id) {
        return ResponseEntity.ok(valoracionService.obtenerValoraciones(id));
    }
}
