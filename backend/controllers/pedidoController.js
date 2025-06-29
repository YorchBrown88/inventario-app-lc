const Pedido = require('../models/Pedido');

const obtenerPedidosEnCurso = async (req, res) => {
  const pedidos = await Pedido.find({ estado: 'en curso' }).populate('cliente').populate('productos.producto');
  res.json(pedidos);
};

const agregarPago = async (req, res) => {
  const { id } = req.params;
  const { tipo, monto } = req.body;

  const pedido = await Pedido.findById(id);
  if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

  pedido.pagos.push({ tipo, monto });

  const totalPagado = pedido.pagos.reduce((acc, pago) => acc + pago.monto, 0);
  if (totalPagado >= pedido.total) pedido.estado = 'pagado';

  await pedido.save();
  res.json(pedido);
};
