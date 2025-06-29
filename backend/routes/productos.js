import express from 'express';
import upload from '../middlewares/upload.js';
import {
  obtenerProductos,
  obtenerProductosDisponibles,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';

const router = express.Router();

router.get('/', obtenerProductos);
router.get('/disponibles', obtenerProductosDisponibles);
router.post('/', upload.single('imagen'), crearProducto);
router.put('/:id', upload.single('imagen'), actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;
