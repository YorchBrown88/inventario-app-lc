import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';


const PedidoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nuevoPago, setNuevoPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');

  useEffect(() => {
    fetchVenta();
  }, [id]);

  const fetchVenta = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas/${id}`);
      const data = await res.json();
      setVenta(data);
    } catch (error) {
      console.error('Error al cargar venta:', error);
    } finally {
      setLoading(false);
    }
  };

  const registrarPago = async () => {
    if (!nuevoPago || isNaN(nuevoPago)) return;
    const body = {
      monto: parseFloat(nuevoPago),
      metodo: metodoPago,
    };
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/ventas/${id}/pago-parcial`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setNuevoPago('');
      fetchVenta(); // Actualiza los datos luego del pago
    } catch (err) {
      console.error('Error registrando pago parcial', err);
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!venta) return <div className="p-4 text-red-500">Venta no encontrada</div>;

  const totalPagado = venta.pagos?.reduce((sum, p) => sum + p.monto, 0) || 0;
  const saldoPendiente = venta.total - totalPagado;
  const vuelto = totalPagado > venta.total ? totalPagado - venta.total : 0;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        className="text-sm text-blue-600 underline mb-4"
        onClick={() => navigate(-1)}
      >
        ← Volver al Cliente
      </button>

      <h2 className="text-xl font-bold mb-2">Detalle del Pedido</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Cliente:</strong> {venta.cliente?.nombre || 'N/A'}</p>
        <p><strong>Cédula:</strong> {venta.cliente?.cedula || 'N/A'}</p>
        <p><strong>Correo:</strong> {venta.cliente?.correo || 'N/A'}</p>
        <p><strong>Teléfono:</strong> {venta.cliente?.telefono || 'N/A'}</p>
        <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
        {venta.observacion && <p><strong>Observación:</strong> {venta.observacion}</p>}
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Productos</h3>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Producto</th>
            <th className="border p-2 text-center">Cantidad</th>
            <th className="border p-2 text-right">Precio Unitario</th>
            <th className="border p-2 text-right">Total</th> 
          </tr>
        </thead>
          <tbody>
            {venta.productos.map((p, i) => (
              <tr key={i}>
                <td className="border p-2 text-left">{p.nombre || p.producto?.nombre || 'Sin nombre'}</td>
                <td className="border p-2 text-center">{p.cantidad}</td>
                <td className="border p-2 text-right">${p.precioUnitario.toFixed(2)}</td>
                <td className="border p-2 text-right">
                  ${(p.precioUnitario * p.cantidad).toFixed(2)} 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Subtotal:</strong> ${venta.subtotal?.toFixed(2) || '0.00'}</p>
        <p><strong>Descuento:</strong> ${venta.descuento?.toFixed(2) || '0.00'}</p>
        <p><strong>Impuestos:</strong> ${venta.impuestos?.toFixed(2) || '0.00'}</p>
        <p className="text-lg font-bold"><strong>Total:</strong> ${venta.total.toFixed(2)}</p>
      </div>

      {venta.pagos && venta.pagos.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold mb-2">Pagos Realizados</h3>
          <ul className="text-sm list-disc list-inside">
            {venta.pagos.map((p, i) => (
              <li key={i}>
                {new Date(p.fecha).toLocaleDateString()} - ${p.monto.toFixed(2)} vía <strong>{p.metodo}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Total Pagado:</strong> ${totalPagado.toFixed(2)}</p>
        <p><strong>Saldo Pendiente:</strong> ${saldoPendiente > 0 ? saldoPendiente.toFixed(2) : '0.00'}</p>
        {vuelto > 0 && (
          <p className="text-green-600 font-semibold"><strong>Vuelto:</strong> ${vuelto.toFixed(2)}</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Registrar Pago Parcial</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          placeholder="Monto"
          value={nuevoPago}
          onChange={(e) => setNuevoPago(e.target.value)}
          className="border p-2 rounded w-1/2"
          disabled={saldoPendiente <= 0} // 👈 Bloquea si ya está pagado
        />
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="border p-2 rounded w-1/2"
          disabled={saldoPendiente <= 0} // 👈 también bloqueado
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="deuda">Deuda</option>
        </select>
      </div>
      {saldoPendiente <= 0 ? (
        <div className="text-green-700 font-semibold">✅ Pedido Completado</div>
      ) : (
        <button
          onClick={registrarPago}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar Pago
        </button>
      )}
    </div>

    </div>
  );
};

export default PedidoDetalle;