import express from 'express';
import Venta from '../models/venta.js';
import {
  registrarVenta,
  obtenerVentasEnCurso,
  obtenerVentaPorId,
  registrarPago,
  registrarPagoParcial,
  completarVenta,
  obtenerPedidosCompletados
} from '../controllers/ventasController.js';

const router = express.Router();

router.post('/', registrarVenta);
router.get('/en-curso', obtenerVentasEnCurso);
router.get('/completados', obtenerPedidosCompletados);
router.get('/:id', obtenerVentaPorId);
router.put('/:id/pagar', registrarPago);
router.put('/:id/completar', completarVenta);
router.put('/:id/pago-parcial', registrarPagoParcial);

router.get('/cliente/:id', async (req, res) => {
  const { id } = req.params;
  const { desde, hasta } = req.query;

  const filtro = { cliente: id };
  if (desde || hasta) {
    filtro.fecha = {};
    if (desde) filtro.fecha.$gte = new Date(desde);
    if (hasta) {
      const fechaFin = new Date(hasta);
      fechaFin.setHours(23, 59, 59, 999);
      filtro.fecha.$lte = fechaFin;
    }
  }

  const ventas = await Venta.find(filtro).sort({ fecha: -1 });
  res.json(ventas);
});

export default router;
