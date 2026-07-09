package com.atr.atr.Service.Int;

import com.atr.atr.DTO.AreaDto;

import java.util.List;
import java.util.Optional;

public interface IArea {
    List<AreaDto> obtenerTodasLasAreas();
    List<AreaDto> obtenerAreasActivas();
    Optional<AreaDto> obtenerAreaPorId(Long id);
    AreaDto guardarArea(AreaDto areaDto);
    AreaDto actualizarArea(Long id, AreaDto areaDto);
    void eliminarArea(Long id);
    Optional<AreaDto> restaurarArea(Long id);  // Cambiado a Optional
    boolean existeArea(Long id);
}
