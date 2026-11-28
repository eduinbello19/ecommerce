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

export async function obtenerHistorialPedidos(idUsuario) {
  const [catalogo, pedidos, pagos] = await Promise.all([
    obtenerCatalogo({ incluirDetalles: true }),
    request('/pedido'),
    request('/pago'),
  ])

  const variantesPorId = new Map(
    (catalogo.variantes || []).map((variante) => [Number(variante.idVariante), variante]),
  )
  const productosPorId = new Map(
    (catalogo.productos || []).map((producto) => [Number(producto.idProducto), producto]),
  )
  const pagosPorPedido = new Map(
    (pagos || []).map((pago) => [Number(pago.idPedido), pago]),
  )
  const detallesPedido = catalogo.detallesPedido || []
  const detallesPorPedido = new Map()

  detallesPedido.forEach((detalle) => {
    const idPedido = Number(detalle.idPedido)
    const detalles = detallesPorPedido.get(idPedido) || []
    detalles.push(detalle)
    detallesPorPedido.set(idPedido, detalles)
  })

  return (pedidos || [])
    .filter((pedido) => Number(pedido.idUsuario) === Number(idUsuario))
    .sort((primero, segundo) => new Date(segundo.fecha) - new Date(primero.fecha))
    .map((pedido) => {
      const idPedido = Number(pedido.idPedido)
      const pago = pagosPorPedido.get(idPedido)
      const items = (detallesPorPedido.get(idPedido) || []).map((detalle) => {
        const variante = variantesPorId.get(Number(detalle.idVariante))
        const producto = productosPorId.get(Number(variante?.idProducto))

        return {
          idVariante: detalle.idVariante,
          nombreProducto: producto?.nombre || 'Producto no disponible',
          rutaImagen: producto?.rutaImagen || '',
          talla: variante?.talla || '',
          color: variante?.color || '',
          colorCode: variante?.colorCode || '',
          cantidad: Number(detalle.cantidad || 0),
          precioUnitario: Number(detalle.precioUnitario || 0),
        }
      })

      return {
        idPedido: pedido.idPedido,
        fecha: pedido.fecha,
        estado: pedido.estado || '',
        subtotal: Number(pedido.subtotal || 0),
        costoEnvio: Number(pedido.costoEnvio || 0),
        total: Number(pedido.total || 0),
        medioPago: pago?.medio || '',
        fechaPago: pago?.fechaPago || null,
        items,
      }
    })
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
