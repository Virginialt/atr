package com.atr.atr.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class ValoracionRequest {

    @Min(1)
    @Max(5)
    private int puntuacion;

    private String comentario;

    public int getPuntuacion() { return puntuacion; }
    public void setPuntuacion(int puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}
