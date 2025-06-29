import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCombos } from '../services/api';

function Combos() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    obtenerCombos()
      .then(setCombos)
      .catch(err => {
        console.error("Error al cargar combos:", err);
        setCombos([]);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🎁 Combos Activos</h1>
        <Link
          to="/crear-combo"
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Crear Combo
        </Link>
      </div>

      {combos.length === 0 ? (
        <p className="text-gray-500">No hay combos disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Nombre</th>
                <th className="p-2 border text-center">Precio</th>
                <th className="p-2 border text-center">Estado</th>
                <th className="p-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {combos.map(combo => (
                <tr key={combo._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{combo.nombre}</td>
                  <td className="p-2 border text-center">${combo.precioVenta?.toFixed(2)}</td>
                  <td className="p-2 border text-center">
                    {combo.activo ? "✅ Activo" : "❌ Inactivo"}
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="Ver">🔍</button>
                    <button className="text-yellow-600 hover:text-yellow-800" title="Editar">✏️</button>
                    <button className="text-red-600 hover:text-red-800" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Combos;
