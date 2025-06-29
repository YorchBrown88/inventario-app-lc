const Insumo = require('../models/Insumo');
const Movimiento = require('../models/MovimientoInventario');
const actualizarDisponibilidad = require('../utils/actualizarDisponibilidadProductos');
const { nombre, unidad, cantidad, costoUnitario } = req.body;

exports.actualizarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, tipo, motivo, ...otrosDatos } = req.body;

    const insumoExistente = await Insumo.findById(id);
        if (!insumoExistente) {
          return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        insumoExistente.nombre = nombre;
        insumoExistente.unidad = unidad;
        insumoExistente.cantidad = cantidad;
        insumoExistente.costoUnitario = costoUnitario;

        await insumoExistente.save();
        res.json(insumoExistente);

    const stockAnterior = insumoExistente.cantidad;

    if (typeof cantidad === 'number' && tipo) {
      if (tipo === 'entrada') {
        insumoExistente.cantidad += cantidad;
      } else if (tipo === 'salida') {
        if (cantidad > insumoExistente.cantidad) {
          return res.status(400).json({ error: 'No hay suficiente stock para esta salida' });
        }
        insumoExistente.cantidad -= cantidad;
      } else {
        return res.status(400).json({ error: 'Tipo de movimiento inválido (entrada o salida)' });
      }

      // Registrar movimiento con stock anterior y final
      await Movimiento.create({
        insumo: id,
        tipo,
        cantidad,
        motivo: motivo || (tipo === 'salida' ? 'Salida manual' : 'Ingreso manual'),
        stockAnterior,
        stockFinal: insumoExistente.cantidad
      });
    }

    // Actualiza otros datos (nombre, unidad, etc.)
    Object.assign(insumoExistente, otrosDatos);

    await insumoExistente.save();
    await actualizarDisponibilidad();

    res.json(insumoExistente);
  } catch (error) {
    console.error('❌ Error al actualizar insumo:', error);
    res.status(500).json({ error: 'Error al actualizar insumo' });
  }
};
