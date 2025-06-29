const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
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
  observacion: String,
  subtotal: Number,
  descuento: Number,
  impuesto: Number,
  total: Number,
  estado: {
    type: String,
    enum: ['en_curso', 'completado'],
    default: 'en_curso'
  },
  pagos: [
    {
      monto: Number,
      metodo: {
        type: String,
        enum: ['efectivo', 'transferencia', 'debito', 'credito', 'deuda'],
        required: true
      },
      fecha: {
        type: Date,
        default: Date.now
      }
    }
  ],
  pagoParcialIniciado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venta', ventaSchema);
