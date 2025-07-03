import { useEffect, useState } from "react";

const unidades = ["Unidad", "gramos", "kg", "litro", "ml"];

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: "", unidad: "Unidad", costoUnitario: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerInsumos();
  }, []);

  const obtenerInsumos = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos`);
    const data = await res.json();
    setInsumos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formulario.nombre.trim()) return;

    if (editandoId) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/api/insumos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formulario, cantidad: 0 }),
      });
    }

    setFormulario({ nombre: "", unidad: "Unidad", costoUnitario: "" });
    setEditandoId(null);
    setMostrarFormulario(false);
    obtenerInsumos();
  };

  const editarInsumo = (insumo) => {
    setFormulario({
      nombre: insumo.nombre,
      unidad: insumo.unidad,
      costoUnitario: insumo.costoUnitario,
    });
    setEditandoId(insumo._id);
    setMostrarFormulario(true);
  };

  const eliminarInsumo = async (id) => {
    if (confirm("¿Estás seguro de eliminar este insumo?")) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${id}`, {
        method: "DELETE",
      });
      obtenerInsumos();
    }
  };

  const normalizar = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const insumosFiltrados = insumos.filter((i) =>
    normalizar(i.nombre).includes(normalizar(busqueda))
  );

  return (
    <div className="p-4">
      <button
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setFormulario({ nombre: "", unidad: "Unidad", costoUnitario: "" });
          setEditandoId(null);
        }}
        className="mb-4 bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        {mostrarFormulario ? "Cancelar" : "+ Agregar Insumo"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
            className="p-2 border rounded flex-1 min-w-[200px]"
          />
          <select
            value={formulario.unidad}
            onChange={(e) => setFormulario({ ...formulario, unidad: e.target.value })}
            className="p-2 border rounded"
          >
            {unidades.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Costo"
            value={formulario.costoUnitario}
            onChange={(e) => setFormulario({ ...formulario, costoUnitario: parseFloat(e.target.value) })}
            className="p-2 border rounded w-32"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editandoId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      <br></br>
      
      <input
        type="text"
        placeholder="Buscar insumo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border p-2 mb-4 rounded w-full sm:w-1/2"
      />

      {/* Tabla Responsive */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-center">Unidad</th>
              <th className="p-2 text-center">Cantidad</th>
              <th className="p-2 text-center">Costo Unitario</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {insumosFiltrados.map((i) => (
              <tr key={i._id} className="border-t">
                <td className="p-2 text-left align-middle">{i.nombre}</td>
                <td className="p-2 text-center align-middle">{i.unidad}</td>
                <td className="p-2 text-center align-middle">{i.cantidad}</td>
                <td className="p-2 text-center align-middle">${i.costoUnitario.toFixed(2)}</td>
                <td className="p-2 text-center align-middle">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => editarInsumo(i)}
                      className="text-blue-600 hover:scale-110"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => eliminarInsumo(i._id)}
                      className="text-red-600 hover:scale-110"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Insumos;
