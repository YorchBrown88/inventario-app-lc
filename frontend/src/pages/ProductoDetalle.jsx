import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PedidoDetalle = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/pedidos/${id}`)
      .then(res => res.json())
      .then(data => setPedido(data))
      .catch(err => {
        console.error("Error al obtener pedido:", err);
        setPedido(null);
      });
  }, [id]);

  if (pedido === null) return <p className="p-4 text-red-600">❌ Pedido no encontrado.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link to="/pedidos-en-curso">
        <button className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 mb-4">
          ← Volver a Pedidos
        </button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">🧾 Detalle del Pedido</h1>

      <p><strong>Cliente:</strong> {pedido.cliente?.nombre ?? 'N/A'}</p>
      <p><strong>Cédula:</strong> {pedido.cedula}</p>
      <p><strong>Observación:</strong> {pedido.observacion || 'Sin observaciones'}</p>

      <h2 className="mt-4 mb-2 font-bold">Productos:</h2>
      <ul className="list-disc list-inside">
        {pedido.productos.map((item, idx) => (
          <li key={idx}>
            {item.nombre} — {item.cantidad} × ${item.precioUnitario.toFixed(2)} = ${(item.cantidad * item.precioUnitario).toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <p><strong>Subtotal:</strong> ${pedido.subtotal.toFixed(2)}</p>
        <p><strong>Descuento:</strong> ${pedido.descuento.toFixed(2)}</p>
        <p><strong>Impuesto:</strong> ${pedido.impuesto.toFixed(2)}</p>
        <h3 className="text-xl font-bold">Total: ${pedido.total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default PedidoDetalle;
