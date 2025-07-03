import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import insumosRoutes from './routes/insumos.js';
import productosRoutes from './routes/productos.js';
import ventasRoutes from './routes/ventas.js';
import movimientosRoutes from './routes/movimientos.js';
import clientesRoutes from './routes/clientes.js';
import reportesRoutes from './routes/reportes.js';
import combosRoutes from './routes/combos.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import comboRoutes from './routes/combos.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/insumos', insumosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/combos', combosRoutes);
app.use('/combos', comboRoutes); // debe estar así

// Ya no necesitas esta línea duplicada ni con require (ELIMINAR):
// app.use('/productos', require('./routes/productos'));

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor disponible en http://0.0.0.0:${PORT}`);
    });

  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
  });
