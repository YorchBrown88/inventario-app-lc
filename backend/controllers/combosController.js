import Combo from '../models/Combo.js';

// Crear nuevo combo
export const crearCombo = async (req, res) => {
  try {
    const { nombre, descripcion, precioVenta, activo } = req.body;
    const productos = JSON.parse(req.body.productos); // productos: JSON string desde FormData

    const productosFormateados = productos.map(p => ({
      producto: p.productoId,
      cantidad: p.cantidad
    }));

    const nuevoCombo = new Combo({
      nombre,
      descripcion,
      precioVenta: parseFloat(precioVenta),
      activo: activo === 'true' || activo === true,
      productos: productosFormateados
    });

    if (req.file) {
      nuevoCombo.imagen = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await nuevoCombo.save();
    res.status(201).json(nuevoCombo);
  } catch (error) {
    console.error('❌ Error al crear combo:', error);
    res.status(500).json({ error: 'Error al crear el combo' });
  }
};

// Actualizar combo existente
export const actualizarCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precioVenta, activo } = req.body;
    const productos = JSON.parse(req.body.productos);

    const combo = await Combo.findById(id);
    if (!combo) return res.status(404).json({ error: 'Combo no encontrado' });

    combo.nombre = nombre;
    combo.descripcion = descripcion;
    combo.precioVenta = parseFloat(precioVenta);
    combo.activo = activo === 'true' || activo === true;
    combo.productos = productos.map(p => ({
      producto: p.productoId,
      cantidad: p.cantidad
    }));

    if (req.file) {
      combo.imagen = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await combo.save();
    res.json(combo);
  } catch (error) {
    console.error('❌ Error al actualizar combo:', error);
    res.status(500).json({ error: 'Error al actualizar el combo' });
  }
};

// Obtener todos los combos
export const obtenerCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate('productos.producto');
    res.json(combos);
  } catch (error) {
    console.error('❌ Error al obtener combos:', error);
    res.status(500).json({ error: 'Error al obtener combos' });
  }
};

// Obtener combo por ID
export const obtenerComboPorId = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('productos.producto');
    if (!combo) {
      return res.status(404).json({ mensaje: 'Combo no encontrado' });
    }
    res.json(combo);
  } catch (error) {
    console.error('Error al obtener combo por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener combo' });
  }
};


// Eliminar combo
export const eliminarCombo = async (req, res) => {
  try {
    const { id } = req.params;
    await Combo.findByIdAndDelete(id);
    res.json({ mensaje: 'Combo eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar combo:', error);
    res.status(500).json({ error: 'Error al eliminar el combo' });
  }
};
