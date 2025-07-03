// src/pages/EditarInsumo.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditarInsumo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insumo, setInsumo] = useState({
    nombre: "",
    unidad: "",
    cantidad: 0,
    costoUnitario: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${id}`)
      .then((res) => res.json())
      .then((data) => setInsumo(data))
      .catch((err) => console.error("Error al cargar insumo:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInsumo({ ...insumo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, unidad, costoUnitario } = insumo;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, unidad, costoUnitario: parseFloat(costoUnitario) }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el insumo");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar insumo");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">✏️ Editar Insumo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={insumo.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Unidad:</label>
          <input
            type="text"
            name="unidad"
            value={insumo.unidad}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Costo Unitario:</label>
          <input
            type="number"
            step="0.01"
            name="costoUnitario"
            value={insumo.costoUnitario}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-500">Cantidad (solo modificable con Entrada/Salida):</label>
          <input
            type="number"
            name="cantidad"
            value={insumo.cantidad}
            disabled
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed text-gray-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditarInsumo;
