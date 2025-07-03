import Cliente from '../models/Cliente.js';

export const obtenerClientes = async (req, res) => {
  try {
    const mostrarInactivos = req.query.todos === 'true';
    const filtro = mostrarInactivos ? {} : { activo: true };

    const clientes = await Cliente.find(filtro);
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
};

export const crearCliente = async (req, res) => {
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

export const actualizarCliente = async (req, res) => {
  try {
    const actualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
};

export const obtenerClientePorId = async (req, res) => {
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

export const obtenerClientePorCedula = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ cedula: req.params.cedula });
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar cliente por cédula', error });
  }
};
