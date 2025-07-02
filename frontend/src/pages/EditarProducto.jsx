import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [insumosDisponibles, setInsumosDisponibles] = useState([]);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`);
        const data = await res.json();

        const insumosFormateados = data.insumos.map(item => ({
          insumoId: item.insumo._id,
          cantidad: item.cantidad
        }));

        setProducto({
          ...data,
          insumos: insumosFormateados
        });
      } catch {
        setError('Error al cargar producto');
      }
    };

    const cargarInsumos = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos`);
      const data = await res.json();
      setInsumosDisponibles(data);
    };

    cargarProducto();
    cargarInsumos();
  }, [id]);

  const handleInsumoChange = (index, field, value) => {
    const nuevosInsumos = [...producto.insumos];
    nuevosInsumos[index][field] = value;
    setProducto({ ...producto, insumos: nuevosInsumos });
  };

  const agregarInsumo = () => {
    setProducto({
      ...producto,
      insumos: [...producto.insumos, { insumoId: '', cantidad: 1 }]
    });
  };

  const eliminarInsumo = (index) => {
    const nuevos = [...producto.insumos];
    nuevos.splice(index, 1);
    setProducto({ ...producto, insumos: nuevos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nombre', producto.nombre);
      formData.append('descripcion', producto.descripcion);
      formData.append('precioVenta', producto.precioVenta);
      formData.append('activo', producto.activo);
      formData.append('insumos', JSON.stringify(
        producto.insumos.filter(i => i.insumoId).map(i => ({
          insumoId: i.insumoId,
          cantidad: parseFloat(i.cantidad)
        }))
      ));

      if (imagenNueva) {
        formData.append('imagen', imagenNueva);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!res.ok) throw new Error('Error al actualizar');

      navigate('/productos');
    } catch (err) {
      console.error(err);
      setError('Error al guardar cambios');
    }
  };

  if (!producto) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">✏️ Editar Producto</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          value={producto.nombre}
          onChange={e => setProducto({ ...producto, nombre: e.target.value })}
          className="w-full border px-2 py-1 rounded"
          placeholder="Nombre"
          required
        />

        <textarea
          name="descripcion"
          value={producto.descripcion}
          onChange={e => setProducto({ ...producto, descripcion: e.target.value })}
          className="w-full border px-2 py-1 rounded"
          placeholder="Descripción"
        />

        <input
          type="number"
          name="precioVenta"
          step="0.01"
          value={producto.precioVenta}
          onChange={e => setProducto({ ...producto, precioVenta: e.target.value })}
          className="w-full border px-2 py-1 rounded"
          placeholder="Precio de Venta"
        />

        <select
          value={producto.activo}
          onChange={e => setProducto({ ...producto, activo: e.target.value === 'true' })}
          className="w-full border px-2 py-1 rounded"
        >
          <option value={true}>✅ Activo</option>
          <option value={false}>❌ Inactivo</option>
        </select>

        <div>
          <p className="mb-1">Imagen actual:</p>
          {producto.imagen && (
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${producto.imagen}`}
            alt="Imagen del producto"
            className="w-24 h-24 object-cover mb-2 rounded"
          />
          )}
          <input
            type="file"
            onChange={e => setImagenNueva(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">🧪 Insumos</h3>
          {producto.insumos.map((item, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={item.insumoId}
                onChange={e => handleInsumoChange(i, 'insumoId', e.target.value)}
                className="w-2/3 border px-2 py-1 rounded"
              >
                <option value="">-- Selecciona un insumo --</option>
                {insumosDisponibles.map(insumo => (
                  <option key={insumo._id} value={insumo._id}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.cantidad}
                min={1}
                onChange={e => handleInsumoChange(i, 'cantidad', e.target.value)}
                className="w-1/3 border px-2 py-1 rounded"
              />
              <button type="button" onClick={() => eliminarInsumo(i)} className="text-red-500 font-bold">✖</button>
            </div>
          ))}
          <button type="button" onClick={agregarInsumo} className="text-sm text-blue-600 hover:underline">
            + Agregar Insumo
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💾 Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditarProducto;
