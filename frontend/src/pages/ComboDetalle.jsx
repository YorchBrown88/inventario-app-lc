import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerComboPorId } from '../services/api';
import { toast } from 'react-toastify';

function ComboDetalle() {
  const { id } = useParams();
  const [combo, setCombo] = useState(null);

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const data = await obtenerComboPorId(id);
        setCombo(data);
      } catch {
        toast.error('Error al cargar el combo');
      }
    };
    fetchCombo();
  }, [id]);

  if (!combo) return <p className="text-center mt-10">Cargando combo...</p>;

  // 🧮 Calcular precio de producción
  const precioProduccion = combo.productos.reduce((total, item) => {
    const costo = item.producto?.precioProduccion || 0;
    return total + costo * item.cantidad;
  }, 0);

  const utilidadEstimada = combo.precioVenta - precioProduccion;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10 space-y-6">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          🔍 Detalles del Combo
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {combo.imagen?.data?.data ? (
            <img
              src={`data:${combo.imagen.contentType};base64,${btoa(
                new Uint8Array(combo.imagen.data.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              )}`}
              alt="Imagen del combo"
              className="w-24 h-24 object-cover rounded-md shadow"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md border">
              Sin imagen
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-800">{combo.nombre}</h2>
            <p className="text-sm text-gray-600">{combo.descripcion || 'Sin descripción'}</p>
          </div>
        </div>
      </div>

      {/* Info Financiera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>💰 Precio Venta (PVP):</strong> ${combo.precioVenta.toFixed(2)}</p>
        <p><strong>🧮 Precio Producción:</strong> ${precioProduccion.toFixed(2)}</p>
        <p><strong>📈 Utilidad Estimada:</strong> ${utilidadEstimada.toFixed(2)}</p>
        <p>
          <strong>📌 Estado:</strong>{' '}
          {combo.activo ? (
            <span className="text-green-600 font-medium">✅ Activo</span>
          ) : (
            <span className="text-red-600 font-medium">❌ Inactivo</span>
          )}
        </p>
      </div>

      {/* Tabla de Productos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">🧾 Productos incluidos:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">Producto</th>
                <th className="px-4 py-2 border-b text-center">Cantidad</th>
                <th className="px-4 py-2 border-b text-center">Costo Unitario</th>
                <th className="px-4 py-2 border-b text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {combo.productos.map((item, idx) => {
                const nombre = item.producto?.nombre || 'Producto eliminado';
                const costo = item.producto?.precioProduccion || 0;
                const subtotal = costo * item.cantidad;

                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{nombre}</td>
                    <td className="px-4 py-2 border-b text-center">{item.cantidad}</td>
                    <td className="px-4 py-2 border-b text-center">${costo.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b text-center">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botón Volver */}
      <div className="pt-4">
        <Link to="/combos" className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md shadow transition">
          ← Volver a Combos
        </Link>
      </div>
    </div>
  );
}

export default ComboDetalle;
