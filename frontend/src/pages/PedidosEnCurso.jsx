import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PedidosEnCurso() {
  const [ventas, setVentas] = useState([]);
  const [pedido, setPedido] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Si hay un ID, traer solo el detalle del pedido
      const obtenerDetalle = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas/${id}`);
          const data = await res.json();
          setPedido(data);
        } catch (error) {
          console.error('Error al cargar el pedido:', error);
        }
      };
      obtenerDetalle();
    } else {
      // Si no hay ID, traer la lista de pedidos en curso
      const obtenerVentas = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas/en-curso`);
          const data = await res.json();
          setVentas(data);
        } catch (error) {
          console.error('Error al cargar pedidos en curso:', error);
        }
      };
      obtenerVentas();
    }
  }, [id]);

  if (id && pedido) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate('/pedidos-en-curso')}
          className="mb-4 text-blue-600 underline"
        >
          ← Volver a la lista
        </button>
        <h1 className="text-2xl font-bold mb-4">🧾 Detalle del Pedido</h1>
        <p><strong>Cliente:</strong> {pedido.cliente?.nombre}</p>
        <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
        <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
        <h2 className="text-lg font-semibold mt-4 mb-2">🛒 Productos</h2>
        <ul className="space-y-2">
          {pedido.productos.map((prod, i) => (
            <li key={i} className="border p-2 rounded">
              <p><strong>{prod.nombre}</strong> - {prod.cantidad} x ${prod.precioUnitario.toFixed(2)}</p>
            </li>
          ))}
        </ul>
        {pedido.observacion && (
          <p className="mt-4"><strong>📝 Observación:</strong> {pedido.observacion}</p>
        )}
      </div>
    );
  }

  if (id && !pedido) {
    return <div className="p-4">Cargando pedido...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📋 Pedidos en Curso</h1>
      <ul className="space-y-4">
        {ventas.map((venta) => (
          <li key={venta._id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">👤 {venta.cliente?.nombre}</p>
              <p>Total: <strong>${venta.total.toFixed(2)}</strong></p>
              <p>Fecha: {new Date(venta.fecha).toLocaleString()}</p>
            </div>
            <button
              onClick={() => navigate(`/pedidos-en-curso/${venta._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ver Pedido
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default PedidosEnCurso;
