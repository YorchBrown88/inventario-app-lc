const Cliente = require('../models/Cliente');


const obtenerClientes = async (req, res) => {
  const clientes = await Cliente.find().sort({ createdAt: -1 });
  res.json(clientes);
};

const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'La cédula ya está registrada.' });
    }
    res.status(500).json({ mensaje: 'Error al crear cliente', error });
  }
};


const actualizarCliente = async (req, res) => {
  const actualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
};

const eliminarCliente = async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Cliente eliminado' });
};

const obtenerClientePorCedula = async (req, res) => {
  const { cedula } = req.params;
  const cliente = await Cliente.findOne({ cedula });
  if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }
  res.json(cliente);
};

const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente', error });
  }
};


module.exports = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerClientePorCedula,
  obtenerClientePorId
};