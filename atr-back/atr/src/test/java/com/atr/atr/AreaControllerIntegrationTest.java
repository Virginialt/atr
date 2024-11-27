package com.atr.atr.integration;

import com.atr.atr.Model.Area;
import com.atr.atr.Repository.AreaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AreaControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;  // Para simular solicitudes HTTP

    @Autowired
    private AreaRepository areaRepository;

    // Test para verificar si se listan todas las áreas activas
    @Test
    public void listarAreasActivas() throws Exception {
        // Ejecutar una solicitud GET a /area
        mockMvc.perform(get("/api/v1/area")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Verificar que el status sea 200
                .andExpect(jsonPath("$").isArray());  // Verificar que la respuesta sea un array JSON
    }

    // Test para agregar un área nueva
    @Test
public void guardarArea() throws Exception {
    String nuevaArea = """
        {
          "nombre": "nueva area",
          "nivel": "GRADO",
          "activo": true
        }
    """;

    // Ejecutar una solicitud POST a /api/v1/area
    mockMvc.perform(post("/api/v1/area")
            .contentType(MediaType.APPLICATION_JSON)
            .content(nuevaArea))
            .andExpect(status().isCreated())  // Verificar que el status sea 201
            .andExpect(jsonPath("$.nombre").value("nueva area"))  // Verificar que el nombre sea el esperado
            .andExpect(jsonPath("$.nivel").value("GRADO"))  // Verificar que el nivel sea el esperado
            .andExpect(jsonPath("$.activo").value(true));  // Verificar que el estado activo sea verdadero
}

    // Test para actualizar un área existente
    @Test
    public void actualizarArea() throws Exception {
        // Crear un área en la base de datos para actualizar
        Area area = new Area();
        area.setNombre("area existente");
        area.setNivel(Area.Nivel.GRADO);
        area.setEstado(Area.Estado.ACTIVA);
        areaRepository.save(area);

        String areaActualizada = """
            {
              "nombre": "area actualizada",
              "nivel": "PREGRADO",
              "activo": true
            }
        """;

        // Ejecutar una solicitud PUT a /area/{id}
        mockMvc.perform(put("/api/v1/area/" + area.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(areaActualizada))
                .andExpect(status().isOk())  // Verificar que el status sea 200
                .andExpect(jsonPath("$.nombre").value("area actualizada"));  // Verificar que el nombre sea el esperado
    }

    // Test para eliminar un área
    @Test
    public void eliminarArea() throws Exception {
        // Crear un área para eliminar
        Area area = new Area();
        area.setNombre("area a eliminar");
        area.setNivel(Area.Nivel.GRADO);
        area.setEstado(Area.Estado.ACTIVA);
        areaRepository.save(area);

        // Ejecutar una solicitud DELETE a /area/{id}
        mockMvc.perform(delete("/api/v1/area/" + area.getId()))
                .andExpect(status().isNoContent());  // Verificar que el status sea 204
    }
}
