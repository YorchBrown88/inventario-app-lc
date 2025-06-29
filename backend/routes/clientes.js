import express from 'express';
import Cliente from '../models/Cliente.js';
import Venta from '../models/Venta.js';
import {
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerClientePorCedula,
} from '../controllers/clientesController.js';

const router = express.Router();

// Obtener todos los clientes con ticketPromedio
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();

    const clientesConTicket = await Promise.all(
      clientes.map(async (cliente) => {
        const ventas = await Venta.find({ cliente: cliente._id });
        const total = ventas.reduce((acc, v) => acc + v.total, 0);
        const cantidad = ventas.length;
        const ticketPromedio = cantidad > 0 ? total / cantidad : 0;

        return {
          ...cliente.toObject(),
          ticketPromedio,
        };
      })
    );

    res.json(clientesConTicket);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

// Buscar por cédula
router.get('/cedula/:cedula', obtenerClientePorCedula);

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// Crear, actualizar, eliminar
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
