const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  obtenerProductos,
  obtenerProductosDisponibles,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productosController');

router.get('/', obtenerProductos);
router.get('/disponibles', obtenerProductosDisponibles);
router.post('/', upload.single('imagen'), crearProducto);
router.put('/:id', upload.single('imagen'), actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
