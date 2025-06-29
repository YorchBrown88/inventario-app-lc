// backend/controllers/pedidosController.js
const Venta = require('../models/Venta');
const Cliente = require('../models/Cliente');

// Obtener todos los pedidos en curso
const obtenerPedidosEnCurso = async (req, res) => {
  try {
    const pedidos = await Venta.find({ estado: 'en_curso' }).populate('cliente').populate('productos.producto');
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Ver detalle de un pedido
const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Venta.findById(req.params.id).populate('cliente').populate('productos.producto');
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

// Agregar un pago parcial o total
const agregarPago = async (req, res) => {
  try {
    const { monto, metodo } = req.body;
    const pedido = await Venta.findById(req.params.id);

    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    pedido.pagos.push({ monto, metodo });
    const totalPagado = pedido.pagos.reduce((acc, p) => acc + p.monto, 0);

    if (totalPagado >= pedido.total) {
      pedido.estado = 'completado';
    }

    await pedido.save();
    res.json({ mensaje: 'Pago registrado correctamente', pedido });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar pago' });
  }
};

module.exports = {
  obtenerPedidosEnCurso,
  obtenerPedidoPorId,
  agregarPago
};
