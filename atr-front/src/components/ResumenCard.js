import React, { useState } from 'react';
import { api } from '../api';
import ConfirmModal from './ConfirmModal';

function ResumenCard({ resumen, onValorado, onEliminado, onVer }) {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const esPropio = user.id === resumen.usuarioId;
  const [puntuando, setPuntuando] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const handleValorar = async (puntuacion) => {
    setPuntuando(true);
    try {
      await api(`/resumenes/${resumen.id}/valorar`, {
        method: 'POST',
        body: JSON.stringify({ puntuacion }),
      });
      if (onValorado) onValorado();
    } catch (e) {
      console.error('Error al valorar', e);
    } finally {
      setPuntuando(false);
    }
  };

  const handleEliminar = () => {
    setConfirm({
      message: '¿Eliminar este resumen?',
      onConfirm: async () => {
        await api(`/resumenes/${resumen.id}`, { method: 'DELETE' });
        if (onEliminado) onEliminado();
      }
    });
  };

  const estrellas = Math.round(resumen.valoracionPromedio || 0);

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{resumen.titulo}</h3>
          {esPropio && (
            <button onClick={handleEliminar} style={{
              background: 'none', border: 'none', color: '#a00', cursor: 'pointer', fontSize: '1.2rem'
            }} title="Eliminar">&times;</button>
          )}
        </div>

        {resumen.materiaNombre && (
          <span className="tag" style={{ alignSelf: 'flex-start' }}>{resumen.materiaNombre}</span>
        )}

        {resumen.descripcion && <p style={{ margin: '5px 0', fontSize: '0.9em' }}>{resumen.descripcion}</p>}

        <div style={{ fontSize: '0.85em', color: '#666' }}>
          Subido por {resumen.usuarioNombre} &middot; {new Date(resumen.createdAt).toLocaleDateString()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(v => (
              <button key={v} onClick={() => handleValorar(v)} disabled={puntuando}
                style={{
                  background: 'none', border: 'none', cursor: puntuando ? 'default' : 'pointer',
                  fontSize: '1.3rem', padding: 0,
                  color: v <= estrellas ? '#ffc107' : '#ddd'
                }}>&#9733;</button>
            ))}
            <span style={{ fontSize: '0.85em', marginLeft: '5px', alignSelf: 'center' }}>
              {resumen.valoracionPromedio > 0 ? resumen.valoracionPromedio.toFixed(1) : ''}
            </span>
          </div>

          <button onClick={() => onVer(resumen)} className="btn btn-sm" style={{ fontSize: '0.9em' }}>
            Ver detalle
          </button>
        </div>
      </div>
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
    </>
  );
}

export default ResumenCard;
