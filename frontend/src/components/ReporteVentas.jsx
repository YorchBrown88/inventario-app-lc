import { useEffect, useState } from 'react';
import { obtenerReporteVentas } from '../services/api';

function ReporteVentas() {
  const [reporte, setReporte] = useState([]);

  useEffect(() => {
    obtenerReporteVentas()
      .then(data => setReporte(data))
      .catch(error => {
        console.error('Error al cargar el reporte de ventas:', error);
        setReporte([]);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Reporte de Ventas</h2>
      {reporte.length === 0 ? (
        <p className="text-gray-500">No hay ventas registradas.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Producto</th>
              <th className="p-2 border">Cantidad Vendida</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reporte.map((venta, index) => (
              <tr key={index}>
                <td className="p-2 border">{venta.producto}</td>
                <td className="p-2 border">{venta.cantidadVendida}</td>
                <td className="p-2 border">${venta.total.toFixed(2)}</td>
                <td className="p-2 border">
                  {new Date(venta.fecha).toLocaleDateString('es-EC')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReporteVentas;
