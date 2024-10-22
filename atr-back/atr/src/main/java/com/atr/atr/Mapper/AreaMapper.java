package com.atr.atr.Mapper;

import com.atr.atr.DTO.AreaDto;
import com.atr.atr.Model.Area;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AreaMapper {
    public AreaDto toDto(Area area) {
        AreaDto dto = new AreaDto();
        dto.setId(area.getId());
        dto.setNombre(area.getNombre());
        dto.setNivel(area.getNivel().toString());
        dto.setActivo(area.getEstado() == Area.Estado.ACTIVA);  // Cambiar aquí
        return dto;
    }

    public Area toEntity(AreaDto dto) {
        Area area = new Area();
        area.setId(dto.getId());
        area.setNombre(dto.getNombre());
        area.setNivel(Area.Nivel.valueOf(dto.getNivel()));
        area.setEstado(dto.getActivo() ? Area.Estado.ACTIVA : Area.Estado.ELIMINADA);  // Cambiar aquí
        return area;
    }

    public List<AreaDto> toDtoList(List<Area> areas) {
        return areas.stream().map(this::toDto).collect(Collectors.toList());
    }
}
