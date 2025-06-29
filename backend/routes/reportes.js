import express from 'express';
import {
  stockBajo,
  topProductosVendidos,
  consumoInsumos,
  obtenerReportes,
  reporteVentas,
  obtenerReporteVentas
} from '../controllers/reportesController.js';

const router = express.Router();

router.get('/stock-bajo', stockBajo);
router.get('/top-productos', topProductosVendidos);
router.get('/consumo-insumos', consumoInsumos);
router.get('/filtro', obtenerReportes);
router.get('/ventas', reporteVentas);
router.get('/', obtenerReporteVentas);

export default router;
