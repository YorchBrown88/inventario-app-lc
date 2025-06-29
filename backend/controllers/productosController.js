const Producto = require('../models/Producto');
const Insumo = require('../models/Insumo');
const Combo = require('../models/Combo'); // asegúrate de tener este modelo

exports.eliminarProducto = async (req, res) => {
  try {
    const productoId = req.params.id;

    // ❗ Verificamos si el producto está en algún combo
    const enCombo = await Combo.findOne({ 'productos.producto': productoId });

    if (enCombo) {
      return res.status(400).json({ mensaje: 'No se puede eliminar el producto porque está vinculado a un combo.' });
    }

    await Producto.findByIdAndDelete(productoId);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('insumos.insumo');
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

exports.obtenerProductosDisponibles = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true }).populate('insumos.insumo');
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    res.status(500).json({ mensaje: 'Error al obtener productos disponibles' });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precioVenta } = req.body;
    const insumosRaw = JSON.parse(req.body.insumos); // viene como string

    // 🔁 Transformamos cada item al formato que el modelo espera
    const insumosTransformados = insumosRaw.map(item => ({
      insumo: item.insumoId,
      cantidad: item.cantidad
    }));

    // 💰 Calculamos el precio de producción
    let precioProduccion = 0;
    for (const item of insumosRaw) {
      const insumo = await Insumo.findById(item.insumoId);
      if (insumo) {
        precioProduccion += insumo.costoUnitario * item.cantidad;
      }
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precioVenta,
      precioProduccion,
      insumos: insumosTransformados,
      imagen: req.file ? req.file.filename : null
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ mensaje: 'Error al crear el producto' });
  }
};



exports.actualizarProducto = async (req, res) => {
  try {
    const { nombre, insumos, precioVenta } = req.body;

    let precioProduccion = 0;
    for (const item of JSON.parse(insumos)) {
      const insumo = await Insumo.findById(item.insumoId);
      if (insumo) {
        precioProduccion += insumo.costoUnitario * item.cantidad;
      }
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        insumos: JSON.parse(insumos),
        precioVenta,
        precioProduccion,
        imagen: req.file ? req.file.filename : undefined,
      },
      { new: true }
    );

    res.json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
};
