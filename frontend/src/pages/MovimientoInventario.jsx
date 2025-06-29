import { useEffect, useState } from 'react';

function MovimientoInventario() {
  const [insumos, setInsumos] = useState([]);
  const [insumoId, setInsumoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [movimientos, setMovimientos] = useState([]);

  // Cargar insumos
  useEffect(() => {
    fetch('http://localhost:3000/api/insumos')
      .then(res => res.json())
      .then(data => setInsumos(data))
      .catch(err => console.error('Error al cargar insumos:', err));
  }, []);

  // Cargar movimientos
  const cargarMovimientos = () => {
    fetch('http://localhost:3000/api/movimientos')
      .then(res => res.json())
      .then(data => setMovimientos(data.reverse())) // Muestra los más recientes primero
      .catch(err => console.error('Error al cargar movimientos:', err));
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/movimientos/${insumoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, cantidad: parseFloat(cantidad), motivo })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Movimiento registrado correctamente');
        setCantidad('');
        setMotivo('');
        cargarMovimientos();
      } else {
        setMensaje(`❌ Error: ${data.error || 'Algo salió mal'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMensaje('❌ Error al enviar datos');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Movimiento de Inventario</h2>

      {mensaje && <p className="mb-4">{mensaje}</p>}

      <form onSubmit={manejarEnvio} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Insumo</label>
          <select
            value={insumoId}
            onChange={(e) => setInsumoId(e.target.value)}
            className="w-full border px-2 py-1"
            required
          >
            <option value="">Selecciona un insumo</option>
            {insumos.map(insumo => (
              <option key={insumo._id} value={insumo._id}>
                {insumo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              value="entrada"
              checked={tipo === 'entrada'}
              onChange={(e) => setTipo(e.target.value)}
            />
            Entrada
          </label>
          <label>
            <input
              type="radio"
              value="salida"
              checked={tipo === 'salida'}
              onChange={(e) => setTipo(e.target.value)}
            />
            Salida
          </label>
        </div>

        <div>
          <label className="block mb-1 font-medium">Cantidad</label>
          <input
            type="number"
            step="any"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full border px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Motivo</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full border px-2 py-1"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrar Movimiento
        </button>
      </form>

      {/* Tabla de movimientos */}
      <h3 className="text-xl font-bold mb-2">📋 Últimos Movimientos</h3>
      {movimientos.length === 0 ? (
        <p className="text-gray-500">No hay movimientos registrados.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-2 border">Insumo</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Cantidad</th>
              <th className="p-2 border">Motivo</th>
              <th className="p-2 border">Stock Anterior</th>
              <th className="p-2 border">Stock Final</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov._id} className="text-sm">
                <td className="p-2 border">{mov.insumo?.nombre || '—'}</td>
                <td className="p-2 border capitalize">{mov.tipo}</td>
                <td className="p-2 border">{mov.cantidad}</td>
                <td className="p-2 border">{mov.motivo}</td>
                <td className="p-2 border">{mov.stockAnterior}</td>
                <td className="p-2 border">{mov.stockFinal}</td>
                <td className="p-2 border">
                  {new Date(mov.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MovimientoInventario;
