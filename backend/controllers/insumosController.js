import Insumo from '../models/Insumo.js';

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
  await Insumo.findByIdAndDelete(id);
  res.json({ mensaje: 'Insumo eliminado' });
};
