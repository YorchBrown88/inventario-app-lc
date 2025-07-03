import Insumo from '../models/Insumo.js';
import Producto from '../models/Producto.js';

export const obtenerInsumos = async (req, res) => {
  const insumos = await Insumo.find();
  res.json(insumos);
};

export const crearInsumo = async (req, res) => {
  const nuevoInsumo = new Insumo(req.body);
  await nuevoInsumo.save();
  res.status(201).json(nuevoInsumo);
};

export const actualizarInsumo = async (req, res) => {
  const { id } = req.params;
  const actualizado = await Insumo.findByIdAndUpdate(id, req.body, { new: true });
  res.json(actualizado);
};

export const eliminarInsumo = async (req, res) => {
  const { id } = req.params;

  try {
    // Validar si el insumo está siendo usado en algún producto
    const productoConInsumo = await Producto.findOne({ 'insumos.insumo': id });

    if (productoConInsumo) {
      return res.status(400).json({ mensaje: '❌ No se puede eliminar el insumo porque está siendo utilizado en un producto.' });
    }

    // Si no está en uso, eliminar
    await Insumo.findByIdAndDelete(id);
    res.json({ mensaje: '✅ Insumo eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar insumo:', error);
    res.status(500).json({ mensaje: '❌ Error al eliminar el insumo' });
  }
};
