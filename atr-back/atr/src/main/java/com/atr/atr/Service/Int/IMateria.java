package com.atr.atr.Service.Int;

import com.atr.atr.DTO.MateriaDto;

import java.util.List;

public interface IMateria {
    List<MateriaDto> obtenerTodasLasMaterias();
    List<MateriaDto> obtenerMateriasActivas();
    MateriaDto obtenerMateriaPorId(Long id);
    MateriaDto crearMateria(MateriaDto materiaDto);
    MateriaDto actualizarMateria(Long id, MateriaDto materiaDto);
    void eliminarMateria(Long id);
    void restaurarMateria(Long id);
    boolean existeMateria(Long id);
}
