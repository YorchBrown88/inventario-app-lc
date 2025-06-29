import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function InsumosList() {
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/insumos")
      .then((res) => res.json())
      .then((data) => setInsumos(data))
      .catch((err) => console.error("Error al cargar insumos:", err));
  }, []);

  const eliminarInsumo = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este insumo?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/insumos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Insumo eliminado correctamente.");
        setInsumos(insumos.filter((insumo) => insumo._id !== id));
      } else {
        alert(data.error || "No se pudo eliminar el insumo.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión al intentar eliminar.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📦 Lista de Insumos</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Unidad</th>
            <th className="p-2 border">Cantidad</th>
            <th className="p-2 border">Costo Unitario</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo._id}>
              <td className="p-2 border">{insumo.nombre}</td>
              <td className="p-2 border">{insumo.unidad}</td>
              <td className="p-2 border">{insumo.cantidad}</td>
              <td className="p-2 border">${insumo.costoUnitario.toFixed(2)}</td>
              <td className="p-2 border flex gap-2">
                <Link
                  to={`/editar-insumo/${insumo._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => eliminarInsumo(insumo._id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InsumosList;
