import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function VerProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`);
        if (!res.ok) throw new Error('No se pudo cargar el producto');
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        console.error('Error:', err);
        setError('❌ Error al cargar el producto');
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (cargando) return <p className="p-4">⏳ Cargando producto...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!producto) return <p className="p-4">Producto no encontrado.</p>;

  const precioProduccion = producto.insumos?.reduce((total, item) => {
    return total + (item.insumo?.costoUnitario || 0) * item.cantidad;
  }, 0) || 0;

  const utilidad = producto.precioVenta - precioProduccion;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Detalles del Producto</h1>

      <div className="mb-6">
        {producto.imagen && (
          <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${producto.imagen}`}
          alt="Imagen del producto"
          className="w-24 h-24 object-cover mb-2 rounded"
        />
        )}
        <h2 className="text-xl font-semibold">{producto.nombre}</h2>
        <p className="text-sm text-gray-600">{producto.descripcion}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p><strong>💰 Precio Venta (PVP):</strong> ${producto.precioVenta.toFixed(2)}</p>
        <p><strong>🔧 Precio Producción:</strong> ${precioProduccion.toFixed(2)}</p>
        <p><strong>📈 Utilidad Estimada:</strong> ${utilidad.toFixed(2)}</p>
        <p><strong>📌 Estado:</strong> {producto.activo ? "✅ Activo" : "❌ Inactivo"}</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">🧪 Insumos:</h3>
      {producto.insumos?.length === 0 ? (
        <p className="text-gray-500">Sin insumos registrados.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Insumo</th>
              <th className="border px-2 py-1 text-center">Cantidad</th>
              <th className="border px-2 py-1 text-center">Costo Unitario</th>
              <th className="border px-2 py-1 text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {producto.insumos.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.insumo?.nombre}</td>
                <td className="border px-2 py-1 text-center">{item.cantidad}</td>
                <td className="border px-2 py-1 text-center">${item.insumo?.costoUnitario.toFixed(2)}</td>
                <td className="border px-2 py-1 text-center">
                  ${(item.insumo?.costoUnitario * item.cantidad).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        <Link
          to="/productos"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Volver a Productos
        </Link>
      </div>
    </div>
  );
}

export default VerProducto;
