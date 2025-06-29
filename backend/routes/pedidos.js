// routes/pedidos.js
import express from 'express';
import { obtenerPedidosEnCurso, agregarPago } from '../controllers/pedidosController.js';

const router = express.Router();

// Obtener todos los pedidos en curso
router.get('/en-curso', obtenerPedidosEnCurso);

// Agregar un nuevo pago parcial
router.post('/:id/pagos', agregarPago);

export default router;
