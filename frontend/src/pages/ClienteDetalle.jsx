import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ClienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    obtenerCliente();
    obtenerVentas();
  }, [id]);

  const obtenerCliente = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${id}`);
      const data = await res.json();
      setCliente(data);
    } catch (error) {
      console.error("Error obteniendo cliente:", error);
    }
  };

  const obtenerVentas = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/ventas/cliente/${id}`);
      const data = await res.json();
      setVentas(data);
      setVentasFiltradas(data); // mostrar todo al inicio
    } catch (error) {
      console.error("Error obteniendo ventas:", error);
    }
  };

  const filtrarVentas = () => {
    if (!fechaInicio || !fechaFin) return;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const resultado = ventas.filter((v) => {
      const fechaVenta = new Date(v.fecha);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });

    setVentasFiltradas(resultado);
  };

  const totalDolares = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);
  const cantidadPedidos = ventasFiltradas.length;
  const ticketPromedio = cantidadPedidos > 0 ? totalDolares / cantidadPedidos : 0;

  if (!cliente) return <p className="p-4">Cargando cliente...</p>;

  return (
    <div className="p-4">
      {/* Botón Volver */}
      <Link to="/clientes">
        <button className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 mb-4">
          ← Volver a la Lista de Clientes
        </button>
      </Link>

      {/* Datos del Cliente */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">👤 Cliente: {cliente.nombre}</h2>
        <p><strong>Cédula:</strong> {cliente.cedula}</p>
        <p><strong>Correo:</strong> {cliente.correo}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>Dirección:</strong> {cliente.direccion}</p>
      </div>

      {/* Filtro y Resumen */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">📦 Pedidos del Cliente</h3>

        <div className="flex flex-wrap gap-2 items-end mb-3">
          <div>
            <label className="block text-sm">Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border p-1 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border p-1 rounded text-sm"
            />
          </div>
          <button
            onClick={filtrarVentas}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Filtrar
          </button>
        </div>

        {/* Resumen */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 mb-4 text-sm text-gray-800">
          <div className="flex-1 bg-gray-100 p-3 rounded shadow text-center">
            <p className="font-semibold">💰 Total</p>
            <p className="text-lg font-medium">${totalDolares.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-gray-100 p-3 rounded shadow text-center">
            <p className="font-semibold">📦 Pedidos</p>
            <p className="text-lg font-medium">{cantidadPedidos}</p>
          </div>
          <div className="flex-1 bg-gray-100 p-3 rounded shadow text-center">
            <p className="font-semibold">📊 Ticket</p>
            <p className="text-lg font-medium">${ticketPromedio.toFixed(2)}</p>
          </div>
        </div>


        {/* Tabla de Pedidos */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Fecha</th>
              <th className="p-2">Total</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((pedido) => (
              <tr key={pedido._id}>
                <td className="p-2 border">{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td className="p-2 border">${pedido.total.toFixed(2)}</td>
                <td className="p-2 border">{pedido.estado === 'completado' ? 'Completado' : 'En curso'}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/pedidos-en-curso/${pedido._id}`)}
                    className="text-blue-600 text-sm underline"
                  >
                    Ver Pedido
                  </button>
                </td>
              </tr>
            ))}
            {ventasFiltradas.length === 0 && (
              <tr>
                <td colSpan="4" className="p-2 text-center text-gray-500">No hay pedidos en este rango</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClienteDetalle;
