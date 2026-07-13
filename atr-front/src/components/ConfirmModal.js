import React from 'react';

function ConfirmModal({ message, onConfirm, onClose }) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '28px 32px',
        maxWidth: '420px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 20px', fontSize: '1rem', color: '#333', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={handleConfirm} className="btn btn-sm" style={{ minWidth: '100px' }}>Sí</button>
          <button onClick={onClose} className="btn btn-sm btn-secondary" style={{ minWidth: '100px' }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
