import { useEffect, useState } from 'react';

function MovimientoInventario() {
  const [insumos, setInsumos] = useState([]);
  const [insumoId, setInsumoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/insumos`)
      .then(res => res.json())
      .then(data => setInsumos(data))
      .catch(err => console.error('Error al cargar insumos:', err));
  }, []);

  const cargarMovimientos = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/movimientos`)
      .then(res => res.json())
      .then(data => setMovimientos(data))
      .catch(err => console.error('Error al cargar movimientos:', err));
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const datosMovimiento = {
      insumo: insumoId,
      tipo,
      cantidad: parseFloat(cantidad),
      motivo
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosMovimiento)
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Movimiento registrado correctamente');
        setCantidad('');
        setMotivo('');
        setInsumoId('');
        setTipo('entrada');
        cargarMovimientos();
      } else {
        setMensaje(`❌ Error: ${data.error || 'Algo salió mal'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMensaje('❌ Error al enviar datos');
    }
  };

  const normalizar = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const movimientosFiltrados = movimientos.filter(mov =>
    normalizar(mov.insumo?.nombre || '').includes(normalizar(busqueda))
  );

  const movimientosAMostrar = mostrarTodos
    ? movimientosFiltrados
    : movimientosFiltrados.slice(0, 15);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Movimiento de Inventario</h2>

      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="🔍 Buscar por insumo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-1 w-full md:w-1/3"
        />
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mostrarFormulario ? 'Cancelar' : 'Registrar Movimiento'}
        </button>
      </div>

      {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}

      {mostrarFormulario && (
        <form onSubmit={manejarEnvio} className="space-y-4 mb-8 bg-gray-100 p-4 rounded">
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
              /> Entrada
            </label>
            <label>
              <input
                type="radio"
                value="salida"
                checked={tipo === 'salida'}
                onChange={(e) => setTipo(e.target.value)}
              /> Salida
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

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar Movimiento
          </button>
        </form>
      )}

      <h3 className="text-xl font-bold mb-2">📋 Últimos Movimientos</h3>
      {movimientosFiltrados.length === 0 ? (
        <p className="text-gray-500">No hay movimientos registrados.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
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
              {movimientosAMostrar.map((mov) => (
                <tr key={mov._id}>
                  <td className="p-2 border">{mov.insumo?.nombre || '—'}</td>
                  <td className={`p-2 border capitalize ${mov.tipo === 'entrada' ? 'text-green-700' : 'text-red-700'}`}>
                    {mov.tipo}
                  </td>
                  <td className="p-2 border">{mov.cantidad}</td>
                  <td className="p-2 border">{mov.motivo}</td>
                  <td className="p-2 border">{mov.stockAnterior}</td>
                  <td className="p-2 border">{mov.stockFinal}</td>
                  <td className="p-2 border">{new Date(mov.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!mostrarTodos && movimientosFiltrados.length > 15 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setMostrarTodos(true)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                🔄 Cargar más
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MovimientoInventario;
