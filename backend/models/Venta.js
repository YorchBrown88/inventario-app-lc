const mongoose = require('mongoose');

const productoVentaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  nombre: String, // guardamos el nombre por si luego se borra el producto
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true }
});

const pagoSchema = new mongoose.Schema({
  monto: { type: Number, required: true },
  metodo: {
    type: String,
    enum: ['efectivo', 'transferencia', 'debito', 'credito', 'deuda'],
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const ventaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  productos: [productoVentaSchema],

  observacion: String,

  subtotal: { type: Number, required: true },
  descuento: { type: Number, default: 0 },
  impuesto: { type: Number, default: 0 },
  total: { type: Number, required: true },

  estado: {
    type: String,
    enum: ['en_curso', 'completado'],
    default: 'en_curso'
  },

  pagos: [pagoSchema],

  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venta', ventaSchema);
