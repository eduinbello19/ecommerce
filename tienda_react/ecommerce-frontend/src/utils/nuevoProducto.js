import { colorSwatch } from './catalogo'

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const COLORES = ['Blanco', 'Negro', 'Gris', 'Rojo']

let contadorVariante = 0

export function nuevaVariante(datos = {}) {
  contadorVariante += 1
  const color = datos.color ?? 'Negro'
  return {
    key: `variante-${contadorVariante}`,
    idVariante: datos.idVariante ?? null,
    talla: datos.talla ?? 'M',
    color,
    colorCode: datos.colorCode || colorSwatch(color),
    stock: datos.stock ?? '',
  }
}

function validarCategoria(form, errors) {
  if (form.categoriaModo === 'nueva' || form.categoriaModo === 'editar') {
    const nombre = form.categoria.nombre.trim()
    if (!nombre) errors['cat-nombre'] = 'El nombre de la categoría es obligatorio.'
    else if (nombre.length > 45) errors['cat-nombre'] = 'Máximo 45 caracteres.'
  }

  if (form.categoriaModo !== 'nueva' && !form.categoriaId) {
    errors.categoriaId = 'Selecciona una categoría.'
  }

  if (form.categoria.descripcion.length > 70) {
    errors['cat-descripcion'] = 'Máximo 70 caracteres.'
  }
}

function validarVariantes(variantes, errors) {
  if (variantes.length === 0) {
    errors.variantes = 'Agrega al menos una variante.'
    return
  }

  const combinaciones = new Set()

  variantes.forEach((variante) => {
    if (!TALLAS.includes(variante.talla)) {
      errors[`talla-${variante.key}`] = 'Selecciona una talla válida.'
    }

    const color = variante.color.trim()
    if (!color) errors[`color-${variante.key}`] = 'El color es obligatorio.'
    else if (color.length > 50) errors[`color-${variante.key}`] = 'Máximo 50 caracteres.'

    const colorCode = String(variante.colorCode || '').trim()
    if (!/^#[0-9a-fA-F]{6}$/.test(colorCode)) {
      errors[`colorCode-${variante.key}`] = 'Ingresa un código hexadecimal válido (#RRGGBB).'
    }

    if (variante.stock === '' || !Number.isInteger(Number(variante.stock)) || Number(variante.stock) < 0) {
      errors[`stock-${variante.key}`] = 'Ingresa un stock entero mayor o igual a cero.'
    }

    const combinacion = `${variante.talla}-${color.toLowerCase()}`
    if (combinaciones.has(combinacion)) {
      errors[`talla-${variante.key}`] = 'Ya existe una variante con esa talla y color.'
    }
    combinaciones.add(combinacion)
  })
}

export function validarFormulario(form, variantes) {
  const errors = {}

  if (form.modo === 'editar' && !form.productoId) {
    errors.productoId = 'Selecciona un producto para editar.'
  }

  validarCategoria(form, errors)

  const nombre = form.producto.nombre.trim()
  if (!nombre) errors.nombre = 'El nombre del producto es obligatorio.'
  else if (nombre.length > 150) errors.nombre = 'Máximo 150 caracteres.'

  if (form.producto.precio === '' || !Number.isFinite(Number(form.producto.precio)) || Number(form.producto.precio) < 0) {
    errors.precio = 'Ingresa un precio mayor o igual a cero.'
  }

  if (
    form.producto.gramajeGsm === ''
    || !Number.isInteger(Number(form.producto.gramajeGsm))
    || Number(form.producto.gramajeGsm) < 0
  ) {
    errors.gramajeGsm = 'Ingresa un gramaje entero mayor o igual a cero.'
  }

  if (form.producto.rutaImagen.length > 200) {
    errors.rutaImagen = 'Máximo 200 caracteres.'
  }

  validarVariantes(variantes, errors)

  return errors
}

function mismoId(valor, id) {
  return Number(valor) === Number(id)
}

export function etiquetaVariante(variante) {
  return `#${variante.idVariante} ${variante.talla || '?'} / ${variante.color || '?'}`
}

export function obtenerPlanEliminacion(form, catalogo) {
  const referenciadas = new Set(
    (catalogo.detallesPedido || []).map((detalle) => Number(detalle.idVariante)),
  )
  const plan = { categorias: [], productos: [], variantes: [], bloqueadas: [] }

  if (form.eliminarTipo === 'categoria' && form.categoriaId) {
    const productos = catalogo.productos.filter((producto) => mismoId(producto.idCategoria, form.categoriaId))
    const variantes = catalogo.variantes.filter((variante) => (
      productos.some((producto) => mismoId(producto.idProducto, variante.idProducto))
    ))

    plan.categorias = [Number(form.categoriaId)]
    plan.productos = productos.map((producto) => Number(producto.idProducto))
    plan.variantes = variantes.map((variante) => Number(variante.idVariante))
    plan.bloqueadas = variantes.filter((variante) => referenciadas.has(Number(variante.idVariante)))
    return plan
  }

  if (form.eliminarTipo === 'producto' && form.productoId) {
    const variantes = catalogo.variantes.filter((variante) => mismoId(variante.idProducto, form.productoId))

    plan.productos = [Number(form.productoId)]
    plan.variantes = variantes.map((variante) => Number(variante.idVariante))
    plan.bloqueadas = variantes.filter((variante) => referenciadas.has(Number(variante.idVariante)))
    return plan
  }

  if (form.eliminarTipo === 'variante' && form.varianteId) {
    const variante = catalogo.variantes.find((item) => mismoId(item.idVariante, form.varianteId))
    if (!variante) return plan

    plan.variantes = [Number(variante.idVariante)]
    plan.bloqueadas = referenciadas.has(Number(variante.idVariante)) ? [variante] : []
    return plan
  }

  return plan
}

export function validarEliminacion(form, catalogo) {
  const errors = {}
  const plan = obtenerPlanEliminacion(form, catalogo)

  if (form.eliminarTipo === 'categoria') {
    if (!form.categoriaId) {
      errors.categoriaEliminarId = 'Selecciona una categoría para eliminar.'
    } else if (!catalogo.categorias.some((categoria) => mismoId(categoria.idCategoria, form.categoriaId))) {
      errors.categoriaEliminarId = 'La categoría ya no existe. Recarga el catálogo.'
    }
  }

  if (form.eliminarTipo === 'producto') {
    if (!form.productoId) {
      errors.productoEliminarId = 'Selecciona un producto para eliminar.'
    } else if (!catalogo.productos.some((producto) => mismoId(producto.idProducto, form.productoId))) {
      errors.productoEliminarId = 'El producto ya no existe. Recarga el catálogo.'
    }
  }

  if (form.eliminarTipo === 'variante') {
    if (!form.productoId) errors.varianteProductoId = 'Selecciona el producto de la variante.'
    if (!form.varianteId) {
      errors.varianteEliminarId = 'Selecciona una variante para eliminar.'
    } else if (!catalogo.variantes.some((variante) => mismoId(variante.idVariante, form.varianteId))) {
      errors.varianteEliminarId = 'La variante ya no existe. Recarga el catálogo.'
    }
  }

  if (plan.bloqueadas.length > 0) {
    const nombres = plan.bloqueadas.map(etiquetaVariante).join(', ')
    errors.eliminar = `No se puede eliminar: ${nombres} ${plan.bloqueadas.length === 1 ? 'aparece' : 'aparecen'} en pedidos existentes.`
  }

  return errors
}
