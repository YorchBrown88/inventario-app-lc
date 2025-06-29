// backend/routes/combos.js
import express from 'express';
import { obtenerCombos } from '../controllers/combosController.js';

const router = express.Router();

router.get('/', obtenerCombos); // Ruta para listar combos

export default router;
