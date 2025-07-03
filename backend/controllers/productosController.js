import Producto from '../models/Producto.js';
import Insumo from '../models/Insumo.js';
import Combo from '../models/Combo.js';

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('insumos.insumo');
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

export const obtenerProductosDisponibles = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true }).populate('insumos.insumo');
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    res.status(500).json({ mensaje: 'Error al obtener productos disponibles' });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precioVenta } = req.body;
    const insumosRaw = JSON.parse(req.body.insumos);

    const insumosTransformados = insumosRaw.map(item => ({
      insumo: item.insumoId,
      cantidad: item.cantidad
    }));

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


export const actualizarProducto = async (req, res) => {
  try {
    const { nombre, insumos, precioVenta, descripcion, activo } = req.body;

    const insumosParsed = JSON.parse(insumos);

    // Validar y transformar insumos
    const insumosTransformados = insumosParsed
      .filter(item => item.insumoId && item.cantidad > 0)
      .map(item => ({
        insumo: item.insumoId,
        cantidad: item.cantidad
      }));

    // Calcular precio de producción
    let precioProduccion = 0;
    for (const item of insumosTransformados) {
      const insumo = await Insumo.findById(item.insumo);
      if (insumo) {
        precioProduccion += insumo.costoUnitario * item.cantidad;
      }
    }

    // Actualización
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        activo: activo === 'true' || activo === true,
        insumos: insumosTransformados,
        precioVenta,
        precioProduccion,
        ...(req.file && { imagen: req.file.filename })
      },
      { new: true }
    );

    res.json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
};


export const eliminarProducto = async (req, res) => {
  try {
    const productoId = req.params.id;

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

export const actualizarFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorito } = req.body;

    const producto = await Producto.findByIdAndUpdate(
      id,
      { favorito },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error actualizando favorito:', error);
    res.status(500).json({ mensaje: 'Error al actualizar favorito' });
  }
};
