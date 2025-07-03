// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerInsumos = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos`);
  return res.json();
};

export const crearProducto = async (formData) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
      method: 'POST',
      body: formData, // ✅ sin JSON.stringify
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.mensaje || 'Error al crear producto');
    }

    return await res.json();
  } catch (err) {
    console.error("Error al crear producto:", err);
    throw err;
  }
};

export const obtenerProductos = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
  const data = await res.json();
  return data;
};


export async function obtenerProductosDisponibles() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/disponibles`);
  return await res.json();
}

export const obtenerVentas = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas`);
  return res.json();
};

export const obtenerReporteVentas = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reportes/ventas`);
  const data = await res.json();
  console.log("📊 Datos del reporte:", data);
  return data;
};

export const obtenerInsumoPorId = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${id}`);
  return res.json();
};

export const actualizarInsumo = async (id, data) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const obtenerMovimientos = async (filtros) => {
  const params = new URLSearchParams();

  if (filtros.insumo) params.append("insumo", filtros.insumo);
  if (filtros.desde) params.append("desde", filtros.desde);
  if (filtros.hasta) params.append("hasta", filtros.hasta);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movimientos?${params}`);
  return await res.json();
};

export async function eliminarProducto(id) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.mensaje || 'Error al eliminar producto');
    }

    return await res.json();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}


// ✅ Al final de api.js o donde tengas agrupadas tus funciones

export async function obtenerCombos() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/combos`);
    if (!response.ok) throw new Error('Error al obtener combos');
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerCombos:", error);
    throw error;
  }
}

export const obtenerComboPorId = async (id) => {
  const res = await fetch(`${API_URL}/combos/${id}`);
  if (!res.ok) throw new Error('Error al obtener combo');
  return res.json();
};


export const crearCombo = async (formData) => {
  const res = await fetch(`${API_URL}/api/combos`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error al crear combo');
  }

  return await res.json();
};

export const eliminarCombo = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/combos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar combo');
  }

  return await res.json();
};
