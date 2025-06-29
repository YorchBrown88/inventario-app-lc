// Obtener todos los pedidos en curso
router.get('/en-curso', obtenerPedidosEnCurso);

// Agregar un nuevo pago parcial
router.post('/:id/pagos', agregarPago);
