import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  imagen: String,
  precioVenta: { type: Number, required: true },
  precioProduccion: { type: Number, default: 0 },
  insumos: [
    {
      insumo: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo', required: true },
      cantidad: { type: Number, required: true }
    }
  ],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;
