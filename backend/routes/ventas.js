const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta'); // <- ESTA ES LA LÍNEA CLAVE

const {
  registrarVenta,
  obtenerVentasEnCurso,
  obtenerVentaPorId,
  registrarPago,
  registrarPagoParcial, // ✅ Asegúrate de importar esta también
  completarVenta,
  obtenerPedidosCompletados
} = require('../controllers/ventasController');

// ✅ Rutas de ventas
router.post('/', registrarVenta);
router.get('/en-curso', obtenerVentasEnCurso);
router.get('/completados', obtenerPedidosCompletados);
router.get('/:id', obtenerVentaPorId);
router.put('/:id/pagar', registrarPago);
router.put('/:id/completar', completarVenta);
router.put('/:id/pago-parcial', registrarPagoParcial); // ✅ Nueva ruta
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

module.exports = router;

