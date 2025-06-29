// backend/routes/movimientos.js

const express = require('express');
const router = express.Router();
const {
  obtenerMovimientos,
  crearMovimiento,
} = require('../controllers/movimientosController');

router.get('/', obtenerMovimientos);
router.post('/', crearMovimiento);

module.exports = router;
