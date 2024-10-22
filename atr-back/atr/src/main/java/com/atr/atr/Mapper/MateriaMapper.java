package com.atr.atr.Mapper;

import com.atr.atr.DTO.MateriaDto;
import com.atr.atr.Model.Area;
import com.atr.atr.Model.Materia;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MateriaMapper {
    // Convert from Entity to DTO
    public MateriaDto toDto(Materia materia) {
        if (materia == null) {
            return null; // Handle null case
        }
        MateriaDto dto = new MateriaDto();
        dto.setId(materia.getId());
        dto.setNombre(materia.getNombre());
        dto.setAnio(materia.getAnio());
        dto.setAreaId(materia.getArea() != null ? materia.getArea().getId() : null); // Handle null Area
        dto.setActivo(materia.getEstado() == Materia.Estado.ACTIVA); // Determine active status from the state
        return dto;
    }

    // Convert from DTO to Entity
    public Materia toEntity(MateriaDto dto) {
        if (dto == null) {
            return null; // Handle null case
        }
        Materia materia = new Materia();
        materia.setId(dto.getId());
        materia.setNombre(dto.getNombre());
        materia.setAnio(dto.getAnio());
        materia.setEstado(dto.getActivo() ? Materia.Estado.ACTIVA : Materia.Estado.ELIMINADA); // Set status based on 'activo'
        // Create a new Area object only with the ID
        Area area = new Area();
        area.setId(dto.getAreaId());
        materia.setArea(area);
        return materia;
    }

    public List<MateriaDto> toDtoList(List<Materia> materias) {
        return materias.stream().map(this::toDto).collect(Collectors.toList());
    }
}
