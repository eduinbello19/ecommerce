export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const COLORES = ['Blanco', 'Negro', 'Gris', 'Rojo']

let contadorVariante = 0

export function nuevaVariante(datos = {}) {
  contadorVariante += 1
  return {
    key: `variante-${contadorVariante}`,
    idVariante: null,
    talla: 'M',
    color: 'Negro',
    stock: '',
    ...datos,
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
