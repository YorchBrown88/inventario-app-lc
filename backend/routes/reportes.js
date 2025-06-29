const express = require('express');
const router = express.Router();
const { obtenerReporteVentas } = require('../controllers/reportesController');

router.get('/', obtenerReporteVentas);

module.exports = router;
