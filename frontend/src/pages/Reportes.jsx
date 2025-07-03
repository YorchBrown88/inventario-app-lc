import { useState, useEffect } from 'react';

function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reportes`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setReportes(data);
        } else {
          console.error('❌ La respuesta no es un array:', data);
        }
      } catch (error) {
        console.error('❌ Error al obtener reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerReportes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Reporte de Ventas Completadas</h1>

      {loading ? (
        <p>Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <p>No hay ventas completadas aún.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Productos</th>
              <th className="p-2 border">Subtotal</th>
              <th className="p-2 border">Descuento</th>
              <th className="p-2 border">Impuesto</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((venta) => (
              <tr key={venta._id}>
                <td className="p-2 border">
                  {venta.cliente?.nombre} <br />
                  <small>{venta.cliente?.cedula}</small>
                </td>
                <td className="p-2 border">
                  <ul className="list-disc pl-4">
                    {venta.productos.map((p, i) => (
                      <li key={i}>
                        {p.producto?.nombre} × {p.cantidad} – ${p.precioUnitario}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border">${venta.subtotal.toFixed(2)}</td>
                <td className="p-2 border">${venta.descuento.toFixed(2)}</td>
                <td className="p-2 border">${venta.impuesto.toFixed(2)}</td>
                <td className="p-2 border font-bold">${venta.total.toFixed(2)}</td>
                <td className="p-2 border">
                  {new Date(venta.fecha).toLocaleString('es-EC')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reportes;
