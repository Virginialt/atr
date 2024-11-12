package com.atr.atr.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.atr.atr.DTO.MateriaDto;
import com.atr.atr.Exception.MateriaNoEncontradaException;
import com.atr.atr.Mapper.MateriaMapper;
import com.atr.atr.Repository.MateriaRepository;
import com.atr.atr.Model.Materia;
import com.atr.atr.Service.Int.IMateria;

@Service
public class MateriaService implements IMateria {

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private MateriaMapper materiaMapper;

    @Override
    public List<MateriaDto> obtenerTodasLasMaterias() {
        // Aquí hacemos un cast a List<Materia> si el método findAll retorna un Iterable
        List<Materia> materias = (List<Materia>) materiaRepository.findAll();
        return materiaMapper.toDtoList(materias);
    }

    @Override
    public List<MateriaDto> obtenerMateriasActivas() {
        // Verificamos que findAll() devuelve un Iterable<Materia>
        List<Materia> materiasActivas = ((List<Materia>) materiaRepository.findAll()).stream()
            .filter(Materia::isActivo) // Cambiado a isActivo() en lugar de getActivo()
            .collect(Collectors.toList());
        return materiaMapper.toDtoList(materiasActivas);
    }

    @Override
    public MateriaDto obtenerMateriaPorId(Long id) {
        Materia materia = materiaRepository.findById(id)
            .orElseThrow(() -> new MateriaNoEncontradaException(id));
        return materiaMapper.toDto(materia);
    }

    @Override
    @Transactional
    public MateriaDto crearMateria(MateriaDto materiaDto) {
        Materia materia = materiaMapper.toEntity(materiaDto);
        materia.setActivo(true); // Asumimos que la nueva materia es activa por defecto
        materia = materiaRepository.save(materia);
        return materiaMapper.toDto(materia);
    }

    @Override
    @Transactional
    public MateriaDto actualizarMateria(Long id, MateriaDto materiaDto) {
        Materia materiaExistente = materiaRepository.findById(id)
            .orElseThrow(() -> new MateriaNoEncontradaException(id));

        materiaExistente.setNombre(materiaDto.getNombre());
        
        materiaRepository.save(materiaExistente);
        return materiaMapper.toDto(materiaExistente);
    }

    @Override
    @Transactional
    public void eliminarMateria(Long id) {
        Materia materiaExistente = materiaRepository.findById(id)
            .orElseThrow(() -> new MateriaNoEncontradaException(id));

        materiaExistente.setActivo(false); // Cambia el estado a inactivo en lugar de eliminar
        materiaRepository.save(materiaExistente);
    }

    @Override
    @Transactional
    public void restaurarMateria(Long id) {
        Optional<Materia> optionalMateria = materiaRepository.findById(id);
        if (optionalMateria.isPresent()) {
            Materia materia = optionalMateria.get();
            materia.setActivo(true); // Restablecer el estado a activo
            materiaRepository.save(materia);
        } else {
            throw new MateriaNoEncontradaException(id);
        }
    }

    @Override
    public boolean existeMateria(Long id) {
        return materiaRepository.existsById(id);
    }
}
