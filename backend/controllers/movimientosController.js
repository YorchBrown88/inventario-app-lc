import Movimiento from '../models/Movimiento.js';
import Insumo from '../models/Insumo.js';

export const obtenerMovimientos = async (req, res) => {
  try {
    const { insumo, desde, hasta } = req.query;
    const filtro = {};

    if (insumo) filtro.insumo = insumo;

    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) {
        const hastaFin = new Date(hasta);
        hastaFin.setHours(23, 59, 59, 999);
        filtro.fecha.$lte = hastaFin;
      }
    }

    const movimientos = await Movimiento.find(filtro)
      .populate("insumo")
      .sort({ fecha: -1 });

    res.json(movimientos);
  } catch (err) {
    console.error("Error al obtener movimientos:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const crearMovimiento = async (req, res) => {
  try {
    const { insumo, tipo, cantidad } = req.body;

    if (!insumo || !tipo || !cantidad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const insumoExistente = await Insumo.findById(insumo);
    if (!insumoExistente) {
      return res.status(404).json({ error: "Insumo no encontrado" });
    }

    const movimiento = new Movimiento({
      insumo,
      tipo,
      cantidad,
      fecha: new Date(),
    });

    await movimiento.save();

    insumoExistente.cantidad =
      tipo === "entrada"
        ? insumoExistente.cantidad + parseFloat(cantidad)
        : insumoExistente.cantidad - parseFloat(cantidad);

    await insumoExistente.save();

    res.status(201).json(movimiento);
  } catch (err) {
    console.error("Error al registrar movimiento:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};
