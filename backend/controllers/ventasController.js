import Venta from '../models/Venta.js';
import Cliente from '../models/Cliente.js';

export const registrarVenta = async (req, res) => {
  try {
    const {
      cedula,
      productos,
      observacion,
      subtotal,
      descuento,
      impuesto,
      total
    } = req.body;

    if (!cedula || !productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Datos incompletos para registrar venta' });
    }

    const cliente = await Cliente.findOne({ cedula });
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    const nuevaVenta = new Venta({
      cliente: cliente._id,
      productos,
      observacion,
      subtotal,
      descuento,
      impuesto,
      total,
      estado: 'en_curso',
      fecha: new Date()
    });

    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error('❌ Error al registrar venta:', error);
    res.status(500).json({ mensaje: 'Error al registrar venta', error: error.message });
  }
};

export const obtenerVentasEnCurso = async (req, res) => {
  try {
    const ventas = await Venta.find({ estado: 'en_curso' }).populate('cliente');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas en curso' });
  }
};

export const obtenerPedidosCompletados = async (req, res) => {
  try {
    const ventas = await Venta.find({ estado: 'completado' }).populate('cliente');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas completadas' });
  }
};

export const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findById(id).populate('cliente').populate('productos.producto');

    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });

    const ventaFormateada = {
      _id: venta._id,
      cliente: venta.cliente,
      fecha: venta.fecha,
      total: venta.total,
      observacion: venta.observacion,
      productos: venta.productos.map(p => ({
        producto: p.producto,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      })),
      pagos: venta.pagos,
      subtotal: venta.subtotal,
      descuento: venta.descuento,
      impuesto: venta.impuesto,
      estado: venta.estado
    };

    res.json(ventaFormateada);
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export const registrarPago = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });

    const { monto, metodo } = req.body;
    venta.pagos.push({ monto, metodo });
    venta.estado = 'completado';

    await venta.save();
    res.json({ mensaje: 'Pago completo registrado', venta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar pago' });
  }
};

export const registrarPagoParcial = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });

    const { monto, metodo } = req.body;
    venta.pagos.push({ monto, metodo });

    const totalPagado = venta.pagos.reduce((acc, p) => acc + p.monto, 0);
    if (totalPagado >= venta.total) {
      venta.estado = 'completado';
    }

    await venta.save();
    res.json({ mensaje: 'Pago parcial registrado', venta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar pago parcial' });
  }
};

export const completarVenta = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });

    venta.estado = 'completado';
    await venta.save();

    res.json({ mensaje: 'Venta completada', venta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al completar venta' });
  }
};
