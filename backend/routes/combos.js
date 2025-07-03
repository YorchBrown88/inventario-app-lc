import express from 'express';

import {
  crearCombo,
  obtenerCombos,
  actualizarCombo,
  eliminarCombo,
  obtenerComboPorId
} from '../controllers/combosController.js';
import multer from 'multer';

const router = express.Router();

// ⚠️ Middleware de multer para subir la imagen
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Rutas
router.get('/', obtenerCombos);
router.get('/:id', obtenerComboPorId);

// 👇 Aquí se usa upload.single('imagen')
router.post('/', upload.single('imagen'), crearCombo);
router.put('/:id', upload.single('imagen'), actualizarCombo);

router.delete('/:id', eliminarCombo);

export default router;
