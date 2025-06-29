const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  insumo: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo', required: true },
  tipo: { type: String, enum: ['entrada', 'salida'], required: true },
  cantidad: { type: Number, required: true },
  motivo: { type: String },
  stockAnterior: { type: Number },
  stockFinal: { type: Number },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movimiento', movimientoSchema);
