import mongoose from 'mongoose';

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

const Insumo = mongoose.model('Insumo', insumoSchema);
export default Insumo;
