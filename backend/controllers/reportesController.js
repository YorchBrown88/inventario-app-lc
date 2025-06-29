import Insumo from '../models/Insumo.js';
import Producto from '../models/Producto.js';
import Venta from '../models/Venta.js';

export const stockBajo = async (req, res) => {
  try {
    const insumos = await Insumo.find({ cantidad: { $lt: 50 } });
    res.json(insumos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener insumos con stock bajo' });
  }
};

export const topProductosVendidos = async (req, res) => {
  try {
    const ventas = await Venta.aggregate([
      {
        $unwind: "$productos"
      },
      {
        $group: {
          _id: "$productos.producto",
          totalVendidas: { $sum: "$productos.cantidad" }
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

export const consumoInsumos = async (req, res) => {
  try {
    const ventas = await Venta.find().populate({
      path: 'productos.producto',
      populate: { path: 'insumos.insumo' }
    });

    const consumo = {};

    ventas.forEach(venta => {
      venta.productos.forEach(({ producto, cantidad }) => {
        if (!producto || !producto.insumos) return;

        producto.insumos.forEach(({ insumo, cantidad: cantidadInsumo }) => {
          if (!insumo) return;

          const id = insumo._id;
          const nombre = insumo.nombre;
          const total = cantidadInsumo * cantidad;

          if (!consumo[id]) {
            consumo[id] = {
              nombre,
              cantidadConsumida: 0
            };
          }

          consumo[id].cantidadConsumida += total;
        });
      });
    });

    res.json(Object.values(consumo));
  } catch (err) {
    res.status(500).json({ error: 'Error al calcular consumo de insumos' });
  }
};

export const obtenerReportes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, producto } = req.query;

    const filtro = {};

    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    if (producto) {
      filtro["productos.producto"] = producto;
    }

    const ventas = await Venta.find(filtro).populate('productos.producto');

    res.json(ventas);
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

export const reporteVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('productos.producto');

    const reporte = ventas.flatMap(v =>
      v.productos.map(p => ({
        producto: p.producto?.nombre || 'Producto eliminado',
        cantidadVendida: p.cantidad,
        total: p.cantidad * (p.producto?.precio || 0),
        fecha: v.fecha
      }))
    );

    res.json(reporte);
  } catch (error) {
    console.error('❌ Error al generar reporte de ventas:', error);
    res.status(500).json({ error: 'Error al generar reporte de ventas' });
  }
};

export const obtenerReporteVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({ estado: 'completado' })
      .sort({ createdAt: -1 })
      .populate('cliente', 'nombre cedula')
      .populate('productos.producto', 'nombre precio');

    res.json(ventas);
  } catch (error) {
    console.error('❌ Error al generar el reporte:', error.message);
    res.status(500).json({ mensaje: 'Error al generar el reporte' });
  }
};
