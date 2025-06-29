import express from 'express';
import upload from '../middlewares/subirImagen.js';
import { crearCombo, obtenerCombos } from '../controllers/combosController.js';

const router = express.Router();

router.post('/', upload.single('imagen'), crearCombo);
router.get('/', obtenerCombos);

export default router;
