export function normalizarRutaImagen(ruta) {
  if (!ruta) return ''

  const normalizada = ruta.replace(/\\/g, '/').replace(/^\/?ecommerce\//i, '/')
  return normalizada.startsWith('/') ? normalizada : `/${normalizada}`
}

export function formatearPrecio(valor) {
  return `$${Number(valor || 0).toLocaleString('es-CO')}`
}

export function agruparVariantesPorProducto(variantes = []) {
  return variantes.reduce((grupos, variante) => {
    const grupo = grupos.get(variante.idProducto) || []
    grupo.push(variante)
    grupos.set(variante.idProducto, grupo)
    return grupos
  }, new Map())
}

export function obtenerVariantePorTalla(variantes = [], talla) {
  return variantes.find((variante) => variante.talla === talla)
}

export function calcularStockTotal(variantes = []) {
  return variantes.reduce((total, variante) => total + Number(variante.stock || 0), 0)
}

export function obtenerColoresUnicos(variantes = []) {
  return [...new Set(variantes.map((variante) => variante.color).filter(Boolean))]
}

export function colorSwatch(color) {
  const colores = {
    Blanco: '#f2efe8',
    Negro: '#111111',
    Gris: '#3a3b3f',
    Rojo: '#e5282b',
  }

  return colores[color] || '#5d5f66'
}

export function estadoStock(stock) {
  if (stock <= 0) return 'agotado'
  if (stock < 3) return 'ultimas'
  return 'disponible'
}
