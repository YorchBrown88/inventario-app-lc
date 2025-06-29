import { useEffect, useState } from 'react';
import { mostrarToast } from '../utils/toastUtils';
import { useNavigate } from 'react-router-dom';

function Ventas() {
  const navigate = useNavigate(); // ✅ Ahora sí, dentro del componente

  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [observacion, setObservacion] = useState('');
  const [cedula, setCedula] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [descuento, setDescuento] = useState({ tipo: 'porcentaje', valor: 0 });
  const [impuesto, setImpuesto] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const agregarProducto = (producto) => {
    const existente = pedido.find(p => p._id === producto._id);
    if (existente) {
      setPedido(pedido.map(p => p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p));
    } else {
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    setPedido(pedido.map(p => p._id === id ? { ...p, cantidad: Number(cantidad) } : p));
  };

  const eliminarProducto = (id) => {
    setPedido(pedido.filter(p => p._id !== id));
  };

  const calcularSubtotal = () =>
    pedido.reduce((acc, p) => acc + (p.precioVenta || 0) * p.cantidad, 0);

  const calcularDescuento = (subtotal) => {
    if (descuento.tipo === 'porcentaje') {
      return subtotal * (descuento.valor / 100);
    }
    return Number(descuento.valor);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const desc = calcularDescuento(subtotal);
    const subDesc = subtotal - desc;
    return subDesc + subDesc * (impuesto / 100);
  };

  const validarCedula = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/clientes/cedula/${cedula}`);
      if (res.ok) {
        const cliente = await res.json();
        setClienteEncontrado(cliente);
        setNuevoCliente(false);
      } else {
        setClienteEncontrado(null);
        setNuevoCliente(true);
      }
    } catch (error) {
      console.error('Error validando cédula', error);
    }
  };

  const enviarPedido = async () => {
  try {
    let clienteId = clienteEncontrado?._id;
    if (nuevoCliente && nuevoNombre) {
      const nuevo = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre, cedula })
      });
      const cliente = await nuevo.json();
      clienteId = cliente._id;
    }

    const venta = {
        cedula,
        productos: pedido.map(p => ({
        producto: p._id,
        nombre: p.nombre, // 👈 esto es CLAVE
        cantidad: p.cantidad,
        precioUnitario: p.precioVenta
      })),

      observacion,
      subtotal: calcularSubtotal(),
      descuento: calcularDescuento(calcularSubtotal()),
      impuesto: impuesto,
      total: calcularTotal()
    };

    const res = await fetch('http://localhost:3000/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Error al registrar venta:', data.mensaje || data);
      mostrarToast('error', data.mensaje || 'Error al registrar venta');
      return;
    }

    // Limpiar estados
    setPedido([]);
    setObservacion('');
    setCedula('');
    setClienteEncontrado(null);
    setNuevoCliente(false);
    setNuevoNombre('');

    mostrarToast('success', 'Pedido enviado a cocina');

    // Redirigir luego de 2.5 segundos
    setTimeout(() => navigate('/pedidos-en-curso'), 2500);

  } catch (err) {
    console.error('❌ Error inesperado:', err);
    mostrarToast('error', 'Error inesperado al registrar el pedido');
  }
};


  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 Ventas</h1>

      <div className="mb-4">
        <label className="block font-semibold">Cédula del Cliente</label>
        <input
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className="border px-3 py-2 w-full mb-2"
        />
        <button
          type="button"
          onClick={validarCedula}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Validar
        </button>
        {clienteEncontrado && <p className="text-green-700 mt-2">👤 Cliente: {clienteEncontrado.nombre}</p>}
        {nuevoCliente && (
          <div className="mt-2">
            <label className="block font-semibold">Nombre del nuevo cliente</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="border px-3 py-2 w-full"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {productos.map(p => (
          <div key={p._id} className="border p-2 rounded shadow text-sm">
            <h3 className="font-bold">{p.nombre}</h3>
            <p>${p.precioVenta?.toFixed(2) ?? '0.00'}</p>
            <button onClick={() => agregarProducto(p)} className="bg-blue-500 text-white text-xs mt-2 px-2 py-1 rounded">Agregar</button>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold">🧾 Detalle del Pedido</h2>
      <table className="w-full border text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedido.map(p => (
            <tr key={p._id}>
              <td className="border p-2">{p.nombre}</td>
              <td className="border p-2">${p.precioVenta?.toFixed(2) ?? '0.00'}</td>
              <td className="border p-2">
                <input
                  type="number"
                  min="1"
                  value={p.cantidad}
                  onChange={(e) => actualizarCantidad(p._id, e.target.value)}
                  className="w-16 border px-2"
                />
              </td>
              <td className="border p-2">
                ${((p.precioVenta || 0) * p.cantidad).toFixed(2)}
              </td>
              <td className="border p-2">
                <button onClick={() => eliminarProducto(p._id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <label className="block font-semibold">Observación del Pedido</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          className="w-full border px-3 py-2"
        ></textarea>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Descuento</label>
          <select
            value={descuento.tipo}
            onChange={(e) => setDescuento({ ...descuento, tipo: e.target.value })}
            className="w-full border px-2 py-1 mb-2"
          >
            <option value="porcentaje">%</option>
            <option value="dolares">$</option>
          </select>
          <input
            type="number"
            value={descuento.valor}
            onChange={(e) => setDescuento({ ...descuento, valor: e.target.value })}
            className="w-full border px-2 py-1"
          />
          <label className="block font-semibold mt-4">Impuesto</label>
          <select
            value={impuesto}
            onChange={(e) => setImpuesto(Number(e.target.value))}
            className="w-full border px-2 py-1"
          >
            <option value={0}>0%</option>
            <option value={12}>12%</option>
            <option value={15}>15%</option>
          </select>
        </div>

        <div className="text-right">
          <p>Subtotal: ${calcularSubtotal().toFixed(2)}</p>
          <p>Descuento: -${calcularDescuento(calcularSubtotal()).toFixed(2)}</p>
          <p>
            Impuesto ({impuesto}%): $
            {((calcularSubtotal() - calcularDescuento(calcularSubtotal())) * (impuesto / 100)).toFixed(2)}
          </p>
          <h2 className="text-xl font-bold">Total: ${calcularTotal().toFixed(2)}</h2>
        </div>
      </div>

      <button
        onClick={enviarPedido}
        className="bg-green-600 text-white px-6 py-2 rounded text-lg"
      >
        🍳 A COCINAR
      </button>
    </div>
  );
}

export default Ventas;
