import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerCombos } from '../services/api';

function Combos() {
  const [combos, setCombos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCombos();
  }, []);

  const cargarCombos = async () => {
    try {
      const data = await obtenerCombos();
      setCombos(data);
    } catch (err) {
      console.error("Error al cargar combos:", err);
      setCombos([]);
    }
  };

  const eliminarCombo = async (id) => {
  const confirmar = confirm("¿Estás seguro de eliminar este combo?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/combos/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error("Error al eliminar combo");

    // Refrescar la lista
    cargarCombos();
  } catch (error) {
    console.error("❌ Error al eliminar combo:", error);
    alert("No se pudo eliminar el combo");
  }
};


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
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver"
                      onClick={() => navigate(`/combos/${combo._id}`)}
                    >
                      🔍
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Editar"
                      onClick={() => navigate(`/editar-combo/${combo._id}`)}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                      onClick={() => eliminarCombo(combo._id)}
                    >
                      🗑️
                    </button>
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
