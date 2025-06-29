// middlewares/subirImagen.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carpeta destino
const storage = multer.memoryStorage(); // Para guardar la imagen en memoria (no en disco)

const upload = multer({ storage });

export default upload;
