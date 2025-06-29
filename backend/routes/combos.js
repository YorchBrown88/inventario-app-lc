import express from 'express';
import { crearCombo, obtenerCombos, actualizarCombo, eliminarCombo } from '../controllers/combosController.js';
import upload from '../middlewares/subirImagen.js';

const router = express.Router();

router.post('/', upload.single('imagen'), crearCombo);
router.get('/', obtenerCombos);
router.put('/:id', upload.single('imagen'), actualizarCombo);
router.delete('/:id', eliminarCombo); // <== ESTA ES LA LÍNEA CLAVE

export default router;
