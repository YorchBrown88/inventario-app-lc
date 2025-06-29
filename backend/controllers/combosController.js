import Combo from '../models/Combo.js';

export const crearCombo = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);
    console.log("FILE RECIBIDO:", req.file);

    const { nombre, descripcion, precioVenta, activo, productos } = req.body;

    if (!productos) {
      return res.status(400).json({ error: "No se recibieron los productos del combo" });
    }

    
    let productosParsed;

    console.log("🧪 Productos recibidos sin parsear:", productos);

    try {
      productosParsed = JSON.parse(productos);
      console.log("✅ Productos parseados correctamente:", productosParsed);
    } catch (error) {
      console.error("❌ Error al parsear productos:", error);
      return res.status(400).json({ error: "Formato inválido en productos" });
    }



    // Convertir a formato esperado por el modelo: { producto, cantidad }
    const productosFormateados = productosParsed.map(p => ({
      producto: p.productoId,
      cantidad: p.cantidad
    }));

    const nuevoCombo = new Combo({
      nombre,
      descripcion,
      precioVenta,
      activo: activo === 'true' || activo === true,
      productos: productosFormateados
    });

    if (req.file) {
      nuevoCombo.imagen = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    console.log("✅ Combo listo para guardar:", nuevoCombo);
    await nuevoCombo.save();

    res.status(201).json(nuevoCombo);
  } catch (error) {
    console.error('❌ Error al crear combo:', error);
    res.status(500).json({ error: 'Error al crear el combo' });
  }
};

export const actualizarCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precioVenta, activo, productos } = req.body;

    console.log("🛠 Actualizando combo:", id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!productos) {
      return res.status(400).json({ error: "Productos no enviados" });
    }

    let productosParsed;
    try {
      productosParsed = JSON.parse(productos);
    } catch (error) {
      console.error("❌ Error al parsear productos:", error);
      return res.status(400).json({ error: "Formato inválido en productos" });
    }

    const productosFormateados = productosParsed.map(p => ({
      producto: p.productoId,
      cantidad: p.cantidad
    }));

    const combo = await Combo.findById(id);
    if (!combo) {
      return res.status(404).json({ error: "Combo no encontrado" });
    }

    combo.nombre = nombre;
    combo.descripcion = descripcion;
    combo.precioVenta = precioVenta;
    combo.activo = activo === 'true' || activo === true;
    combo.productos = productosFormateados;

    if (req.file) {
      combo.imagen = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await combo.save();
    res.json(combo);
  } catch (error) {
    console.error("❌ Error al actualizar combo:", error);
    res.status(500).json({ error: "Error al actualizar el combo" });
  }
};

export const obtenerCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate('productos.producto');
    res.json(combos);
  } catch (error) {
    console.error('Error al obtener combos:', error);
    res.status(500).json({ error: 'Error al obtener los combos' });
  }
};

export const eliminarCombo = async (req, res) => {
  try {
    const { id } = req.params;
    await Combo.findByIdAndDelete(id);
    res.json({ mensaje: 'Combo eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar combo:', error);
    res.status(500).json({ mensaje: 'Error al eliminar combo' });
  }
};
