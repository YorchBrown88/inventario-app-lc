import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { mostrarToast } from '../utils/toastUtils';
import { useNavigate } from 'react-router-dom';
import quitarTildes from '../utils/quitarTildes';


function Ventas() {
  const navigate = useNavigate();
  const inputBusquedaRef = useRef();
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [vista, setVista] = useState('favoritos');
  const [busqueda, setBusqueda] = useState('');
  const [pedido, setPedido] = useState([]);
  const [observacion, setObservacion] = useState('');
  const [cedula, setCedula] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [descuento, setDescuento] = useState({ tipo: 'porcentaje', valor: 0 });
  const [impuesto, setImpuesto] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [mostrarFooterFijo, setMostrarFooterFijo] = useState(true);

  useEffect(() => {
    const manejarScroll = () => {
      const scrollY = window.scrollY;
      const alturaVisible = window.innerHeight;
      const alturaTotal = document.body.offsetHeight;

      const alFinal = scrollY + alturaVisible >= alturaTotal - 20;
      setMostrarFooterFijo(!alFinal);
    };

    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);


  useEffect(() => {
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [productosRes, combosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/productos`),
        fetch(`${import.meta.env.VITE_API_URL}/api/combos`)
      ]);
      
      const [productosData, combosData] = await Promise.all([
        productosRes.json(),
        combosRes.json()
      ]);

      setProductos(productosData);
      setCombos(combosData);
    } catch (err) {
      console.error('Error cargando productos o combos:', err);
    } finally {
      setCargando(false);
    }
  };

  cargarDatos();
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/cedula/${cedula}`);
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
        const nuevo = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevoNombre, cedula })
        });
        const cliente = await nuevo.json();
        clienteId = cliente._id;
      }

      const venta = {
        cedula,
        productos: pedido.map(p => {
        console.log("Agregando al pedido:", p); // 👈 pon esto
        return {
          producto: p._id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precioUnitario: p.precioVenta
        };
      }),

        observacion,
        subtotal: calcularSubtotal(),
        descuento: calcularDescuento(calcularSubtotal()),
        impuesto: impuesto,
        total: calcularTotal()
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas`, {
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

      setPedido([]);
      setObservacion('');
      setCedula('');
      setClienteEncontrado(null);
      setNuevoCliente(false);
      setNuevoNombre('');

      mostrarToast('success', 'Pedido enviado a cocina');
      setTimeout(() => navigate('/pedidos-en-curso'), 2500);
    } catch (err) {
      console.error('❌ Error inesperado:', err);
      mostrarToast('error', 'Error inesperado al registrar el pedido');
    }
  };

  const filtrarPorBusqueda = (items) =>
    items.filter(item => {
      if (!busqueda || busqueda.length < 3) return true;
      const texto = quitarTildes(item.nombre.toLowerCase());
      const filtro = quitarTildes(busqueda.toLowerCase());
      return texto.includes(filtro);
    });

  const mostrarFavoritos = () => [
    ...productos.filter(p => p.favorito),
    ...combos.filter(c => c.favorito)
  ];

  const dataMostrada = () => {
  if (busqueda && busqueda.length >= 3) {
    // Buscar en todos: productos y combos
    return [...productos, ...combos];
  }

  // Si no hay búsqueda, seguir mostrando por vista seleccionada
  if (vista === 'favoritos') return mostrarFavoritos();
  if (vista === 'productos') return productos;
  return combos;
  };


  const resultados = filtrarPorBusqueda(dataMostrada());

  if (cargando) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50"></div>
      <p className="text-gray-600 text-lg font-semibold">Cargando menú...</p>
    </div>
    );
  }

  const total = calcularTotal();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-4">
  <label className="block font-semibold mb-1">Cédula del Cliente</label>
  <div className="flex flex-wrap items-center gap-2">
    <input
      type="text"
      value={cedula}
      onChange={(e) => setCedula(e.target.value)}
      className="flex-1 min-w-[180px] border px-3 py-2 rounded"
      placeholder="Ej. 0102030405"
    />
    <button
      type="button"
      onClick={validarCedula}
      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
      title="Validar Cédula"
    >
      🔍
    </button>
  </div>

  {clienteEncontrado && (
    <p className="text-green-700 mt-2">👤 Cliente: {clienteEncontrado.nombre}</p>
  )}
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


      <div className="flex items-center gap-2 mb-4">
  <input
    type="text"
    placeholder="Buscar producto o combo..."
    ref={inputBusquedaRef}
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="flex-1 border px-3 py-2 rounded shadow-sm"
  />
  {busqueda.length > 0 && (
    <button
      onClick={() => {
        setBusqueda('');
        inputBusquedaRef.current?.focus(); // enfoca automáticamente
      }}
      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Limpiar
    </button>
  )}
</div>


      <div className="flex justify-center gap-4 mb-6">
        {['favoritos', 'productos', 'combos'].map((cat) => (
          <button
            key={cat}
            onClick={() => setVista(cat)}
            className={`px-4 py-2 rounded-md font-medium border transition ${
              vista === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">


        {resultados.map(p => (
          <div key={p._id} className="border p-2 rounded shadow text-sm">
            {p.imagen ? (
             
             <div className="aspect-square w-full overflow-hidden rounded mb-2 bg-gray-100">
             <img
                src={
                  p.imagen.data
                    ? `data:${p.imagen.contentType};base64,${btoa(
                        new Uint8Array(p.imagen.data.data).reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          ''
                        )
                      )}`
                    : `${import.meta.env.VITE_API_URL}/uploads/${p.imagen}`
                }
                alt={p.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-400 rounded mb-2">
                Sin imagen
              </div>
            )}
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
  
    {mostrarFooterFijo && pedido.length > 0 && (
      <div className="fixed bottom-0 right-0 w-full lg:max-w-[calc(100%-256px)] px-4 py-3 bg-white border-t shadow-lg flex justify-between items-center z-50">

        <p className="text-lg font-semibold">Total: ${calcularTotal().toFixed(2)}</p>
        <button
          onClick={enviarPedido}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🍳 A COCINAR
        </button>
      </div>
    )}
    </div>

    
  );
}

export default Ventas;
