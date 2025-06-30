import express from 'express';
import { obtenerMovimientos, registrarMovimiento } from '../controllers/movimientosController.js';

const router = express.Router();

router.get('/', obtenerMovimientos);
router.post('/', registrarMovimiento);

export default router;
