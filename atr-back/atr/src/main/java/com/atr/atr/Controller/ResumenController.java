package com.atr.atr.Controller;

import com.atr.atr.DTO.CrearResumenRequest;
import com.atr.atr.DTO.ResumenDto;
import com.atr.atr.Service.ResumenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("${path_mapping}/resumenes")
public class ResumenController {

    @Autowired
    private ResumenService resumenService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumenDto> crearResumen(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("materiaId") Long materiaId,
            Authentication authentication) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CrearResumenRequest request = new CrearResumenRequest();
        request.setTitulo(titulo);
        request.setDescripcion(descripcion);
        request.setMateriaId(materiaId);

        ResumenDto resumen = resumenService.crearResumen(file, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(resumen);
    }

    @GetMapping
    public ResponseEntity<List<ResumenDto>> listarResumenes(
            @RequestParam(required = false) Long materiaId,
            @RequestParam(required = false) String buscar) {
        return ResponseEntity.ok(resumenService.listarResumenes(materiaId, buscar));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumenDto> obtenerResumen(@PathVariable Long id) {
        return ResponseEntity.ok(resumenService.obtenerResumen(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarResumen(@PathVariable Long id, Authentication authentication) {
        resumenService.eliminarResumen(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
