const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  telefono: String,
  correo: String,
  direccion: String,
}, { timestamps: true });

module.exports = mongoose.model('Cliente', clienteSchema);
