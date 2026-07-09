package com.atr.atr.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.atr.atr.DTO.AreaDto;
import com.atr.atr.Mapper.AreaMapper;
import com.atr.atr.Model.Area;
import com.atr.atr.Service.AreaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "${path_mapping}/area")
@CrossOrigin(value = "${path_cross}")
public class AreaController {

    @Autowired
    private AreaService areaService;

    @Autowired
    private AreaMapper areaMapper;

    // Listar todas las áreas activas
    @GetMapping
    public ResponseEntity<List<AreaDto>> listarAreas() {
        List<AreaDto> areaDtos = areaService.obtenerAreasActivas(); // Usar AreaDto aquí
        return ResponseEntity.ok(areaDtos);
    }

    // Guardar una nueva área
    @PostMapping
    public ResponseEntity<AreaDto> guardarArea(@Valid @RequestBody AreaDto areaDto) {
        AreaDto savedAreaDto = areaService.guardarArea(areaDto); // Guardar y convertir a DTO
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAreaDto); // Retornar el área guardada
    }

    // Obtener un área por ID
    @GetMapping("/{id}")
    public ResponseEntity<AreaDto> obtenerAreaPorId(@PathVariable Long id) {
        Optional<AreaDto> areaOptional = areaService.obtenerAreaPorId(id);
        return areaOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Actualizar un área existente
    @PutMapping("/{id}")
    public ResponseEntity<AreaDto> actualizarArea(@PathVariable Long id, @Valid @RequestBody AreaDto areaDto) {
        if (!areaService.existeArea(id)) {
            return ResponseEntity.notFound().build(); // Retornar 404 si el área no existe
        }
        AreaDto updatedAreaDto = areaService.actualizarArea(id, areaDto); // Actualizar área y convertir a DTO
        return ResponseEntity.ok(updatedAreaDto); // Retornar área actualizada
    }

    // Eliminar lógicamente un área
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarArea(@PathVariable Long id) {
        if (!areaService.existeArea(id)) {
            return ResponseEntity.notFound().build(); // Retornar 404 si el área no existe
        }
        areaService.eliminarArea(id); // Eliminación lógica
        return ResponseEntity.noContent().build(); // Retornar 204 No Content
    }

    // Restaurar un área eliminada
    @PutMapping("/restaurar/{id}")
    public ResponseEntity<AreaDto> restaurarArea(@PathVariable Long id) {
        if (!areaService.existeArea(id)) {
            return ResponseEntity.notFound().build(); // Retornar 404 si el área no existe
        }
        areaService.restaurarArea(id);
        Optional<AreaDto> restoredAreaOptional = areaService.obtenerAreaPorId(id);
        return restoredAreaOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
