const Insumo = require('../models/Insumo');

const obtenerInsumos = async (req, res) => {
  const insumos = await Insumo.find();
  res.json(insumos);
};

const crearInsumo = async (req, res) => {
  const nuevoInsumo = new Insumo(req.body);
  await nuevoInsumo.save();
  res.status(201).json(nuevoInsumo);
};

const actualizarInsumo = async (req, res) => {
  const { id } = req.params;
  const actualizado = await Insumo.findByIdAndUpdate(id, req.body, { new: true });
  res.json(actualizado);
};

const eliminarInsumo = async (req, res) => {
  const { id } = req.params;
  await Insumo.findByIdAndDelete(id);
  res.json({ mensaje: 'Insumo eliminado' });
};

module.exports = {
  obtenerInsumos,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
};
