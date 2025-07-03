import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerComboPorId } from '../services/api';
import { toast } from 'react-toastify';

function ComboDetalle() {
  const { id } = useParams();
  const [combo, setCombo] = useState(null);

 useEffect(() => {
  console.log('ID del combo:', id);
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Detalle del Combo</h1>

      {combo.imagen?.data?.data && (
        <img
          className="mb-4 rounded shadow"
          src={`data:${combo.imagen.contentType};base64,${btoa(
            new Uint8Array(combo.imagen.data.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          )}`}
          alt="Imagen del combo"
          width={250}
        />
      )}

      <div className="bg-white shadow rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">{combo.nombre}</h2>
        <p className="text-gray-600">{combo.descripcion}</p>
        <p><strong>💲 Precio de venta:</strong> ${combo.precioVenta.toFixed(2)}</p>
        <p><strong>Estado:</strong> {combo.activo ? 'Activo ✅' : 'Inactivo ❌'}</p>

        <h3 className="mt-4 font-semibold text-lg">🧾 Productos incluidos:</h3>
        <ul className="list-disc ml-6">
          {combo.productos.map((item, idx) => (
            <li key={idx}>
              {item.producto?.nombre || 'Producto eliminado'} — Cantidad: {item.cantidad}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ComboDetalle;
