const Insumo = require('../models/Insumo');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

exports.stockBajo = async (req, res) => {
  try {
    const insumos = await Insumo.find({ cantidad: { $lt: 50 } });
    res.json(insumos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener insumos con stock bajo' });
  }
};

exports.topProductosVendidos = async (req, res) => {
  try {
    const ventas = await Venta.aggregate([
      {
        $group: {
          _id: '$producto',
          totalVendidas: { $sum: '$cantidadVendida' }
        }
      },
      {
        $sort: { totalVendidas: -1 }
      },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      {
        $unwind: '$producto'
      }
    ]);

    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
};

exports.consumoInsumos = async (req, res) => {
  try {
    const ventas = await Venta.find().populate({
      path: 'producto',
      populate: { path: 'insumos.insumo' }
    });

    const consumo = {};

    ventas.forEach(venta => {
      venta.producto.insumos.forEach(item => {
        const id = item.insumo._id;
        const nombre = item.insumo.nombre;
        const total = item.cantidad * venta.cantidadVendida;

        if (!consumo[id]) {
          consumo[id] = {
            nombre,
            cantidadConsumida: 0
          };
        }

        consumo[id].cantidadConsumida += total;
      });
    });

    res.json(Object.values(consumo));
  } catch (err) {
    res.status(500).json({ error: 'Error al calcular consumo de insumos' });
  }
};

exports.obtenerReportes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, producto } = req.query;

    const filtro = {};

    // Filtrar por fecha (si hay rango de fechas)
    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    // Filtrar por producto
    if (producto) {
      filtro.producto = producto;
    }

    const ventas = await Venta.find(filtro).populate('producto');

    res.json(ventas);
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

exports.reporteVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('producto');

    const reporte = ventas.map(v => ({
      producto: v.producto?.nombre || 'Producto eliminado',
      cantidadVendida: v.cantidadVendida,
      total: v.cantidadVendida * (v.producto?.precio || 0),
      fecha: v.fecha
    }));

    res.json(reporte);
  } catch (error) {
    console.error('❌ Error al generar reporte de ventas:', error);
    res.status(500).json({ error: 'Error al generar reporte de ventas' });
  }
};

const obtenerReporteVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({ estado: 'completado' }) // Solo ventas completadas
      .sort({ createdAt: -1 }) // Las más recientes primero
      .populate('cliente', 'nombre cedula')
      .populate('productos.producto', 'nombre precio');

    res.json(ventas);
  } catch (error) {
    console.error('❌ Error al generar el reporte:', error.message);
    res.status(500).json({ mensaje: 'Error al generar el reporte' });
  }
};

module.exports = {
  obtenerReporteVentas
};
