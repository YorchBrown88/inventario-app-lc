import express from 'express';
import upload from '../middlewares/upload.js';
import {
  obtenerProductos,
  obtenerProductosDisponibles,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';
import Producto from '../models/Producto.js'; // ✅ ESTA LÍNEA ES CLAVE


const router = express.Router();

router.get('/', obtenerProductos);
router.get('/disponibles', obtenerProductosDisponibles);
router.post('/', upload.single('imagen'), crearProducto);
router.put('/:id', upload.single('imagen'), actualizarProducto);
router.delete('/:id', eliminarProducto);
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('insumos.insumo');
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});


export default router;
