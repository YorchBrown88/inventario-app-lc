import { useEffect, useState } from 'react';

function PedidosCompletados() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/ventas/completados')
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Pedidos Completados</h1>

      {pedidos.length === 0 ? (
        <p>No hay pedidos completados aún.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Cliente</th>
              <th className="border px-2 py-1">Productos</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Pagos</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido._id}>
                <td className="border px-2 py-1">{pedido.cliente?.nombre}</td>
                <td className="border px-2 py-1">
                  <ul>
                    {pedido.productos.map(p => (
                      <li key={p._id}>
                        {p.producto?.nombre} x {p.cantidad}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1">${pedido.total.toFixed(2)}</td>
                <td className="border px-2 py-1">{new Date(pedido.updatedAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <ul>
                    {pedido.pagos.map((pago, index) => (
                      <li key={index}>${pago.monto} - {pago.metodo}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PedidosCompletados;
