import mongoose from 'mongoose';

const comboSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ],
  precioVenta: { type: Number, required: true },
  activo: { type: Boolean, default: true },
  favorito: { type: Boolean, default: false }, // 👈 Agregado aquí correctamente
  imagen: {
    data: Buffer,
    contentType: String
  }
});

const Combo = mongoose.models.Combo || mongoose.model('Combo', comboSchema);
export default Combo;
