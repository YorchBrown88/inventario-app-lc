const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  insumo: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo', required: true },
  tipo: { type: String, enum: ['entrada', 'salida'], required: true },
  cantidad: { type: Number, required: true },
  motivo: { type: String, required: true },
  stockAnterior: { type: Number, required: true },
  stockFinal: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Movimiento || mongoose.model('Movimiento', movimientoSchema);
