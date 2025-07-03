import { useEffect, useState } from 'react';
import { obtenerInsumos, crearProducto } from '../services/api';
import { useNavigate } from 'react-router-dom';

function CrearProducto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null); // 🟡 NUEVO
  const [insumos, setInsumos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerInsumos().then(data => setInsumos(data));
  }, []);

  const agregarInsumo = () => {
    setSeleccionados([...seleccionados, { insumoId: '', cantidad: 1 }]);
  };

  const actualizarInsumo = (index, key, value) => {
    const nuevos = [...seleccionados];
    nuevos[index][key] = value;
    setSeleccionados(nuevos);
  };

  const eliminarInsumo = (index) => {
    const nuevos = [...seleccionados];
    nuevos.splice(index, 1);
    setSeleccionados(nuevos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precioVenta', parseFloat(precio));
    if (imagen) formData.append('imagen', imagen); 

    // Agregar los insumos como JSON string
    formData.append('insumos', JSON.stringify(
      seleccionados.map(item => ({
        insumoId: item.insumoId,
        cantidad: parseFloat(item.cantidad)
      }))
    ));

    await crearProducto(formData); 
    navigate('/productos');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">➕ Crear Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Descripción del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border p-2 rounded"
          rows="3"
        />

        <input
          type="number"
          placeholder="Precio de venta"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full border p-2 rounded"
          step="0.01"
          required
        />

        {/* NUEVO - Carga de imagen */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <div>
          <h2 className="font-semibold mb-2">📦 Insumos:</h2>
          {seleccionados.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={item.insumoId}
                onChange={(e) => actualizarInsumo(index, 'insumoId', e.target.value)}
                className="flex-1 border p-2 rounded"
              >
                <option value="">Selecciona un insumo</option>
                {insumos.map((insumo) => (
                  <option key={insumo._id} value={insumo._id}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) => actualizarInsumo(index, 'cantidad', e.target.value)}
                className="w-24 border p-2 rounded"
                placeholder="Cantidad"
                step="0.01"
              />
              <button
                type="button"
                onClick={() => eliminarInsumo(index)}
                className="text-red-600"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={agregarInsumo}
            className="mt-2 text-sm bg-gray-200 px-3 py-1 rounded"
          >
            + Agregar Insumo
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
}

export default CrearProducto;
