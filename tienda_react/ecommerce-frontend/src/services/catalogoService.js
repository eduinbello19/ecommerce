const API_BASE = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || `No fue posible completar la solicitud (${path}).`)
    error.status = response.status
    throw error
  }

  return data
}

function jsonRequest(method, path, payload) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function obtenerCatalogo({ incluirDetalles = false } = {}) {
  const peticiones = [
    request('/categoria'),
    request('/producto'),
    request('/variante'),
  ]

  if (incluirDetalles) peticiones.push(request('/detalle-pedido'))

  const [categorias, productos, variantes, detallesPedido = []] = await Promise.all(peticiones)

  return { categorias, productos, variantes, detallesPedido }
}

export function crearCategoria(datos) {
  return jsonRequest('POST', '/categoria', datos)
}

export function actualizarCategoria(id, datos) {
  return jsonRequest('PUT', `/categoria/${id}`, datos)
}

export function eliminarCategoria(id) {
  return request(`/categoria/${id}`, { method: 'DELETE' })
}

export function crearProducto(datos) {
  return jsonRequest('POST', '/producto', datos)
}

export function actualizarProducto(id, datos) {
  return jsonRequest('PUT', `/producto/${id}`, datos)
}

export function eliminarProducto(id) {
  return request(`/producto/${id}`, { method: 'DELETE' })
}

export function crearVariante(datos) {
  return jsonRequest('POST', '/variante', datos)
}

export function actualizarVariante(id, datos) {
  return jsonRequest('PUT', `/variante/${id}`, datos)
}

export function eliminarVariante(id) {
  return request(`/variante/${id}`, { method: 'DELETE' })
}

export function describeCatalogoError(error) {
  if (error.status === 400) return 'Revisa los campos del formulario e inténtalo de nuevo.'
  if (error.status === 404) return 'No se encontró el registro seleccionado. Recarga el catálogo.'
  if (error.status === 409) return 'El registro está asociado a pedidos existentes y no se puede eliminar.'
  if (error.status === 500) return 'La base de datos rechazó el cambio. Revisa dependencias o la configuración de la tabla.'
  return 'No fue posible conectar con el servidor. Verifica que la API esté activa.'
}
