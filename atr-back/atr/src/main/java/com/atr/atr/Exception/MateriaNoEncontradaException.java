package com.atr.atr.Exception;

public class MateriaNoEncontradaException extends RuntimeException {
    public MateriaNoEncontradaException( Long id) {
        super ("No se encontró la materia con ID: " +id);
    }
}