const Producto = require('../models/Producto');

const actualizarDisponibilidadProductos = async () => {
  const productos = await Producto.find().populate('insumos.insumo');

  for (const producto of productos) {
    let disponible = true;

    console.log(`📦 Evaluando producto: ${producto.nombre}`);
    console.log('📦 Insumos:', JSON.stringify(producto.insumos, null, 2));

    for (const item of producto.insumos) {
      const insumo = item.insumo;

      if (!insumo) {
        console.log(`⚠️ Insumo no encontrado`);
        disponible = false;
        break;
      }

      console.log(`🔍 Insumo: ${insumo.nombre} - Stock: ${insumo.cantidad} - Requiere: ${item.cantidad}`);

      if (insumo.cantidad < item.cantidad) {
        disponible = false;
        console.log(`❌ No hay suficiente stock de ${insumo.nombre}`);
        break;
      }
    }

    if (producto.disponible !== disponible) {
      await Producto.findByIdAndUpdate(producto._id, { disponible });
      console.log(`🛠️ Se actualizó en base de datos: "${producto.nombre}" → disponible: ${disponible}`);
    } else {
      console.log(`✅ "${producto.nombre}" mantiene su estado (${producto.disponible})`);
    }
  }
};

module.exports = actualizarDisponibilidadProductos;
