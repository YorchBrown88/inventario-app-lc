import mongoose from 'mongoose';

const comboSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  imagen: { type: String },
  precioVenta: { type: Number, required: true },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      cantidad: Number,
    }
  ],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

const Combo = mongoose.model('Combo', comboSchema);
export default Combo; // ✅ esto es clave para usar 'import Combo from ...'
