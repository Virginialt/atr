package com.atr.atr.Exception;

public class AreaNoEncontradaException extends RuntimeException {
    public AreaNoEncontradaException( Long id) {
        super ("No se encontró el área con ID: " +id);
    }
}