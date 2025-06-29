import Combo from '../models/Combo.js'; // modelo mongoose o el que uses

export const obtenerCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate('productos.producto'); // si usas referencias
    res.json(combos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener combos' });
  }
};
