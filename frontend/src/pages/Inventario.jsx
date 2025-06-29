import { useEffect, useState } from 'react';

function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState({
    nombre: '',
    unidad: '',
    cantidad: 0,
    costoUnitario: 0
  });

  useEffect(() => {
    obtenerInsumos();
  }, []);

  const obtenerInsumos = async () => {
    const res = await fetch('http://localhost:3000/api/insumos');
    const data = await res.json();
    setInsumos(data);
  };

  const agregarInsumo = async () => {
    if (!nuevoInsumo.nombre || !nuevoInsumo.unidad) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const res = await fetch('http://localhost:3000/api/insumos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoInsumo)
    });

    if (res.ok) {
      setNuevoInsumo({ nombre: '', unidad: '', cantidad: 0, costoUnitario: 0 });
      obtenerInsumos();
    } else {
      alert('Error al agregar insumo');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Gestión de Insumos</h1>
     
      {/* Formulario para agregar insumo */}
      <div className="bg-gray-100 p-4 rounded mb-6 shadow">
        <h2 className="font-semibold mb-2">Agregar nuevo insumo</h2>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoInsumo.nombre}
            onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Unidad (ej. kg, ml)"
            value={nuevoInsumo.unidad}
            onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, unidad: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={nuevoInsumo.cantidad}
            onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, cantidad: Number(e.target.value) })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Costo Unitario"
            value={nuevoInsumo.costoUnitario}
            onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, costoUnitario: Number(e.target.value) })}
            className="border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={agregarInsumo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Agregar Insumo
        </button>
      </div>

      {/* Tabla de insumos */}
      <table className="w-full border text-sm shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Unidad</th>
            <th className="border px-2 py-1">Cantidad</th>
            <th className="border px-2 py-1">Costo Unitario</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map(insumo => (
            <tr key={insumo._id}>
              <td className="border px-2 py-1">{insumo.nombre}</td>
              <td className="border px-2 py-1">{insumo.unidad}</td>
              <td className="border px-2 py-1">{insumo.cantidad}</td>
              <td className="border px-2 py-1">${insumo.costoUnitario.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Insumos;
