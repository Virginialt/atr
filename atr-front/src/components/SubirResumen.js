import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api/v1';

function SubirResumen({ onCreado, onCancelar }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [error, setError] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/materia`)
      .then(r => r.json())
      .then(setMaterias)
      .catch(() => setError('Error al cargar materias'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) { setError('Seleccioná un archivo'); return; }
    setSubiendo(true);
    setError('');

    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('materiaId', materiaId);

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/resumenes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        onCreado();
      } else {
        setError('Error al subir el resumen');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', color: 'black', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Subir resumen</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required
          style={{ padding: '12px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }} />
        <textarea placeholder="Descripción (opcional)" value={descripcion} onChange={e => setDescripcion(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px', fontSize: '15px', resize: 'vertical' }} />
        <select value={materiaId} onChange={e => setMateriaId(e.target.value)} required
          style={{ padding: '12px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white' }}>
          <option value="">Seleccioná una materia</option>
          {materias.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
        <input type="file" onChange={e => setArchivo(e.target.files[0])} required
          style={{ padding: '10px', fontSize: '14px' }} />
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={subiendo}
            style={{ padding: '12px 24px', backgroundColor: '#4a1010', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: subiendo ? 0.6 : 1, fontSize: '15px' }}>
            {subiendo ? 'Subiendo...' : 'Subir'}
          </button>
          <button type="button" onClick={onCancelar}
            style={{ padding: '12px 24px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubirResumen;
