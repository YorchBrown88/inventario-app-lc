const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  unidad: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    default: 0
  },
  costoUnitario: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Insumo', insumoSchema);
