// src/pages/EditarCombo.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductosDisponibles, obtenerCombos, crearCombo } from '../services/api';
import { toast } from 'react-toastify';

function EditarCombo() {
  const { id } = useParams();
  const [combo, setCombo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);
  const [activo, setActivo] = useState(true);
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [productosDisponibles, combos] = await Promise.all([
          obtenerProductosDisponibles(),
          obtenerCombos()
        ]);

        setProductos(productosDisponibles);

        const comboExistente = combos.find(c => c._id === id);
        if (!comboExistente) {
          toast.error("Combo no encontrado");
          return navigate('/combos');
        }

        setCombo(comboExistente);
        setNombre(comboExistente.nombre);
        setDescripcion(comboExistente.descripcion || '');
        setPrecio(comboExistente.precioVenta);
        setActivo(comboExistente.activo);
        setSeleccionados(comboExistente.productos.map(p => ({
          productoId: p.producto._id,
          cantidad: p.cantidad
        })));
      } catch (error) {
        toast.error("Error al cargar los datos");
      }
    }

    fetchData();
  }, [id]);

  const actualizarProducto = (index, key, value) => {
    const nuevos = [...seleccionados];
    nuevos[index][key] = value;
    setSeleccionados(nuevos);
  };

  const agregarProducto = () => {
    setSeleccionados([...seleccionados, { productoId: '', cantidad: 1 }]);
  };

  const eliminarProducto = (index) => {
    const nuevos = [...seleccionados];
    nuevos.splice(index, 1);
    setSeleccionados(nuevos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (seleccionados.length === 0) {
      toast.warning("Debes agregar al menos un producto");
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precioVenta', parseFloat(precio));
    formData.append('activo', activo);
    if (imagen) formData.append('imagen', imagen);

    formData.append('productos', JSON.stringify(
      seleccionados.map(item => ({
        productoId: item.productoId,
        cantidad: parseFloat(item.cantidad)
      }))
    ));

    try {
      await fetch(`http://localhost:3000/api/combos/${id}`, {
        method: 'PUT',
        body: formData
      });

      toast.success("Combo actualizado correctamente");
      navigate('/combos');
    } catch (error) {
      toast.error("Error al actualizar combo");
    }
  };

  if (!combo) return <p>Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">✏️ Editar Combo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del combo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Descripción del combo"
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="w-full border p-2 rounded"
        />
        <div>
          <h2 className="font-semibold mb-2">📦 Productos del combo:</h2>
          {seleccionados.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={item.productoId}
                onChange={(e) => actualizarProducto(index, 'productoId', e.target.value)}
                className="flex-1 border p-2 rounded"
              >
                <option value="">Selecciona un producto</option>
                {productos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)}
                className="w-24 border p-2 rounded"
                placeholder="Cantidad"
                step="0.01"
              />
              <button
                type="button"
                onClick={() => eliminarProducto(index)}
                className="text-red-600"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={agregarProducto}
            className="mt-2 text-sm bg-gray-200 px-3 py-1 rounded"
          >
            + Agregar Producto
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <label>Activo</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Actualizar Combo
        </button>
      </form>
    </div>
  );
}

export default EditarCombo;
