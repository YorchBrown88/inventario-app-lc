import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', cedula: '', correo: '', telefono: '', direccion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const navigate = useNavigate();

  const cargarClientes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes?todos=${mostrarInactivos}`);
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      setMensaje('❌ Error cargando clientes');
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [mostrarInactivos]);

  const manejarCambio = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!cliente.nombre || !cliente.cedula) {
      setMensaje('❌ Nombre y cédula son obligatorios');
      return;
    }

    const url = editandoId
      ? `${import.meta.env.VITE_API_URL}/api/clientes/${editandoId}`
      : `${import.meta.env.VITE_API_URL}/api/clientes`;
    const metodo = editandoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMensaje(`❌ ${errorData.mensaje || 'Error al guardar cliente'}`);
        return;
      }

      setMensaje(editandoId ? '✅ Cliente actualizado' : '✅ Cliente agregado');
      setCliente({ nombre: '', cedula: '', correo: '', telefono: '', direccion: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      setMostrarInactivos(false);
      cargarClientes();
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  const manejarEditar = (cliente) => {
    setCliente(cliente);
    setEditandoId(cliente._id);
    setMostrarFormulario(true);
  };

  const toggleActivo = async (id, estadoActual) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !estadoActual })
      });

      if (!res.ok) {
        setMensaje('❌ No se pudo cambiar el estado');
        return;
      }

      setMensaje(`✅ Cliente ${estadoActual ? 'inactivado' : 'activado'}`);
      setTimeout(() => setMensaje(''), 2000);
      cargarClientes();
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  const normalizar = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const clientesFiltrados = clientes.filter((cli) =>
    normalizar(cli.nombre).includes(normalizar(busqueda)) ||
    normalizar(cli.cedula).includes(normalizar(busqueda))
  );

  const ocultarCedula = (cedula) =>
    cedula.length >= 3 ? `***${cedula.slice(-3)}` : cedula;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {mensaje && <p className="mb-4 text-green-700 font-medium">{mensaje}</p>}

      {/* Encabezado con botones y buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              setCliente({ nombre: '', cedula: '', correo: '', telefono: '', direccion: '' });
              setEditandoId(null);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <FaPlus /> {mostrarFormulario ? 'Cancelar' : 'Agregar nuevo cliente'}
          </button>

          <button
            onClick={() => setMostrarInactivos(!mostrarInactivos)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {mostrarInactivos ? 'Ocultar Inactivos' : 'Mostrar Inactivos'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre o cédula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-1/3"
        />
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={manejarEnvio}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border p-4 rounded shadow bg-gray-50"
        >
          {[{ label: 'Nombre', name: 'nombre', required: true },
            { label: 'Cédula', name: 'cedula', required: true },
            { label: 'Correo', name: 'correo', type: 'email' },
            { label: 'Teléfono', name: 'telefono' },
            { label: 'Dirección', name: 'direccion', full: true }
          ].map((field) => (
            <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
              <label className="block font-semibold">{field.label}</label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={cliente[field.name]}
                onChange={manejarCambio}
                className="w-full border px-3 py-2"
                required={field.required}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editandoId ? 'Actualizar Cliente' : 'Agregar Cliente'}
            </button>
          </div>
        </form>
      )}

      {/* Tabla de clientes */}
      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-center">Cédula</th>
            <th className="p-2 text-center">Ticket Promedio</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados
            .filter((cli) => cli.activo === !mostrarInactivos)
            .map((cli) => (
              <tr key={cli._id} className="border-t text-center">
                <td className="p-2 text-left">{cli.nombre}</td>
                <td className="p-2">{ocultarCedula(cli.cedula)}</td>
                <td className="p-2">${(cli.ticketPromedio || 0).toFixed(2)}</td>
                <td className="p-2">
                  <div className="flex justify-center gap-3 items-center">
                    <button onClick={() => navigate(`/clientes/${cli._id}`)} className="text-blue-600">
                      <FaEye />
                    </button>
                    <button onClick={() => manejarEditar(cli)} className="text-yellow-500">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => toggleActivo(cli._id, cli.activo)}
                      className={cli.activo ? 'text-red-600' : 'text-green-600'}
                      title={cli.activo ? 'Inactivar' : 'Activar'}
                    >
                      {cli.activo ? '❌' : '✅'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
