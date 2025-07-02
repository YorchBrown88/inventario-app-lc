import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eliminarProducto, obtenerProductosDisponibles } from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductosDisponibles()
      .then(data => setProductos(data))
      .catch(err => {
        console.error("Error cargando productos:", err);
        setProductos([]);
      });
  }, []);
  
  const handleEliminar = async (id) => {
  if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

  try {
    await eliminarProducto(id);
    setProductos(prev => prev.filter(p => p._id !== id));
  } catch (error) {
    alert(error.response?.data?.mensaje || 'Error al eliminar el producto');
  }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🍔 Productos Disponibles</h1>
        <Link
          to="/crear-producto"
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Crear Producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">


                    <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Imagen</th>
            <th className="p-2 border text-left">Nombre</th>
            <th className="p-2 border text-center">Precio</th>
            <th className="p-2 border text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto._id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">
                {producto.imagen ? (
                  <img
                    src={`http://localhost:3000/uploads/${producto.imagen}`}
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </td>
              <td className="p-2 border">{producto.nombre}</td>
              <td className="p-2 border text-center">${producto.precioVenta?.toFixed(2)}</td>
              <td className="p-2 border text-center space-x-2">
                <Link
                  to={`/productos/${producto._id}`}
                  title="Ver">🔍
                </Link>

                <Link
                  to={`/editar-producto/${producto._id}`}
                  title="Editar"
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  ✏️
                </Link>
                <button
                  title="Eliminar"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleEliminar(producto._id)}
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

export default Productos;
