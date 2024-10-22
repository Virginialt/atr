package com.atr.atr.Controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.atr.atr.DTO.MateriaDto;
import com.atr.atr.Mapper.MateriaMapper;
import com.atr.atr.Model.Materia;
import com.atr.atr.Service.MateriaService;
import com.atr.atr.Service.AreaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value="${path_mapping}")
@CrossOrigin(value="${path_cross}")

public class MateriaController {

    @Autowired
    private MateriaService materiaService;
    @Autowired
    private AreaService areaService;
    @Autowired
    private MateriaMapper materiaMapper;

    // Listar todas las materias activas
    @GetMapping("materia")
    public ResponseEntity<List<MateriaDto>> listarMaterias() {
        List<MateriaDto> materiaDtos = materiaService.obtenerMateriasActivas();
        return ResponseEntity.ok(materiaDtos);
    }

    // Guardar una nueva materia
    @PostMapping("materia")
    public ResponseEntity<MateriaDto> guardarMateria(@Valid @RequestBody MateriaDto materiaDto) {
        // Validar la existencia del área asociada
        if (!areaService.existeArea(materiaDto.getAreaId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        MateriaDto savedMateriaDto = materiaService.crearMateria(materiaDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMateriaDto);
    }

    // Obtener una materia por ID
    @GetMapping("materia/{id}")
    public ResponseEntity<MateriaDto> obtenerMateriaPorId(@PathVariable Long id) {
        MateriaDto materiaDto = materiaService.obtenerMateriaPorId(id);
        return ResponseEntity.ok(materiaDto);
    }

    // Actualizar una materia existente
    @PutMapping("materia/{id}")
    public ResponseEntity<MateriaDto> actualizarMateria(@PathVariable Long id, @Valid @RequestBody MateriaDto materiaDto) {
        // Validar la existencia del área asociada
        if (!areaService.existeArea(materiaDto.getAreaId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        if (!materiaService.existeMateria(id)) {
            return ResponseEntity.notFound().build();
        }
        MateriaDto updatedMateriaDto = materiaService.actualizarMateria(id, materiaDto);
        return ResponseEntity.ok(updatedMateriaDto);
    }

    // Eliminar lógicamente una materia
    @DeleteMapping("materia/{id}")
    public ResponseEntity<Void> eliminarMateria(@PathVariable Long id) {
        if (!materiaService.existeMateria(id)) {
            return ResponseEntity.notFound().build();
        }
        materiaService.eliminarMateria(id); // Eliminación lógica
        return ResponseEntity.noContent().build();
    }

    // Restaurar una materia eliminada
    @PutMapping("materia/restaurar/{id}")
    public ResponseEntity<MateriaDto> restaurarMateria(@PathVariable Long id) {
        materiaService.restaurarMateria(id);
        MateriaDto restoredMateriaDto = materiaService.obtenerMateriaPorId(id);
        return ResponseEntity.ok(restoredMateriaDto);
    }
}