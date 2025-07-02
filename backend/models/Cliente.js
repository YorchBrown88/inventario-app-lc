import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  telefono: String,
  correo: String,
  direccion: String,
  activo: { type: Boolean, default: true },
  activo: { type: Boolean, default: true }, // ← Esto es clave
}, { timestamps: true });

const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', clienteSchema);
export default Cliente;
