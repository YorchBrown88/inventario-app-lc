const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  imagen: { type: String }, // ruta de imagen subida
  precioVenta: { type: Number, required: true },
  precioProduccion: { type: Number, default: 0 }, // 💰 nuevo campo calculado
  insumos: [
    {
      insumo: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo', required: true },
      cantidad: { type: Number, required: true },
    }
  ],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
