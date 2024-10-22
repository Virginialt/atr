package com.atr.atr.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.atr.atr.DTO.AreaDto;
import com.atr.atr.Exception.AreaNoEncontradaException;
import com.atr.atr.Mapper.AreaMapper;
import com.atr.atr.Repository.AreaRepository;
import com.atr.atr.Model.Area;
import com.atr.atr.Service.Int.IArea;

@Service
public class AreaService implements IArea {
    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private AreaMapper areaMapper;

    @Override
    public List<AreaDto> obtenerTodasLasAreas() {
        return areaRepository.findAll().stream()
            .map(areaMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<AreaDto> obtenerAreasActivas() {
        List<Area> areas = (List<Area>) areaRepository.findAll();
        return areas.stream()
                    .filter(area -> area.getEstado() == Area.Estado.ACTIVA)
                    .map(areaMapper::toDto)
                    .collect(Collectors.toList());
    }


    @Override
    public Optional<AreaDto> obtenerAreaPorId(Long id) {
        Area area = areaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("El área con ID " + id + " no fue encontrada"));
        return Optional.of(areaMapper.toDto(area));
    }

    @Override
    @Transactional
    public AreaDto guardarArea(AreaDto areaDto) {
        Area area = areaMapper.toEntity(areaDto);
        area.setEstado(Area.Estado.ACTIVA);
        area = areaRepository.save(area);
        return areaMapper.toDto(area);
    }

    @Override
    @Transactional
    public AreaDto actualizarArea(Long id, AreaDto areaDto) {
        Area areaExistente = areaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("El área con ID " + id + " no fue encontrada"));
        
        areaExistente.setNombre(areaDto.getNombre());
        areaExistente.setNivel(Area.Nivel.valueOf(areaDto.getNivel()));
        areaExistente.setActivo(areaDto.getActivo()); // Usar el método setActivo

        areaRepository.save(areaExistente);
        return areaMapper.toDto(areaExistente);
    }

    @Override
    @Transactional
    public void eliminarArea(Long id) {
        Area areaExistente = areaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("El área con ID " + id + " no fue encontrada"));
        
        areaExistente.asEliminar(); // Llamar al método para establecer estado a ELIMINADA
        areaRepository.save(areaExistente);
    }

    @Override
    @Transactional
    public Optional<AreaDto> restaurarArea(Long id) {
        Area area = areaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("El área con ID " + id + " no fue encontrada"));
        
        area.setEstado(Area.Estado.ACTIVA);
        area = areaRepository.save(area);
        return Optional.of(areaMapper.toDto(area));
    }

    @Override
    public boolean existeArea(Long id) {
        return areaRepository.existsById(id);
    }
}
