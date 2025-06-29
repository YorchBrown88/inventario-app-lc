import express from 'express';
import {
  obtenerInsumos,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
} from '../controllers/insumosController.js';

const router = express.Router();

// Rutas
router.get('/', obtenerInsumos);
router.post('/', crearInsumo);
router.put('/:id', actualizarInsumo);
router.delete('/:id', eliminarInsumo);

export default router;
