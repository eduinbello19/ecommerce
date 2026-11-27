import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import VariantEditor from './VariantEditor'
import {
  actualizarCategoria,
  actualizarProducto,
  actualizarVariante,
  crearCategoria,
  crearProducto,
  crearVariante,
  describeCatalogoError,
  eliminarCategoria,
  eliminarProducto,
  eliminarVariante,
  obtenerCatalogo,
} from '../../services/catalogoService'
import { normalizarRutaImagen } from '../../utils/catalogo'
import {
  etiquetaVariante,
  nuevaVariante,
  obtenerPlanEliminacion,
  validarEliminacion,
  validarFormulario,
} from '../../utils/nuevoProducto'

const CATALOGO_VACIO = { categorias: [], productos: [], variantes: [], detallesPedido: [] }
const CATEGORIA_VACIA = { nombre: '', descripcion: '' }
const PRODUCTO_VACIO = { nombre: '', precio: '', gramajeGsm: '', rutaImagen: '' }
const PLAN_VACIO = { categorias: [], productos: [], variantes: [], bloqueadas: [] }
const ETIQUETAS_MODO = { nuevo: '[ALTA]', editar: '[EDICIÓN]', eliminar: '[ELIMINAR]' }
const ETIQUETAS_ELIMINAR = { producto: 'PRODUCTO', categoria: 'CATEGORÍA', variante: 'VARIANTE' }
const INITIAL_FORM = {
  modo: 'nuevo',
  eliminarTipo: 'producto',
  productoId: '',
  varianteId: '',
  categoriaModo: 'nueva',
  categoriaId: '',
  categoria: CATEGORIA_VACIA,
  producto: PRODUCTO_VACIO,
}

function buscarCategoria(categorias, id) {
  return categorias.find((categoria) => String(categoria.idCategoria) === String(id))
}

export default function NewProductForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [variantes, setVariantes] = useState(() => [nuevaVariante()])
  const [variantesOriginales, setVariantesOriginales] = useState([])
  const [variantesEliminadas, setVariantesEliminadas] = useState([])
  const [catalogo, setCatalogo] = useState(CATALOGO_VACIO)
  const [estadoCatalogo, setEstadoCatalogo] = useState('cargando')
  const [errorCatalogo, setErrorCatalogo] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [imagenFallida, setImagenFallida] = useState('')
  const [confirmacionPendiente, setConfirmacionPendiente] = useState(false)

  const obtenerDatosCatalogo = useCallback(() => obtenerCatalogo({ incluirDetalles: true }), [])

  useEffect(() => {
    let activo = true

    obtenerDatosCatalogo()
      .then((datos) => {
        if (!activo) return
        setCatalogo(datos)
        setEstadoCatalogo('listo')
      })
      .catch((fallo) => {
        if (!activo) return
        setErrorCatalogo(fallo.message || 'No fue posible cargar el catálogo.')
        setEstadoCatalogo('error')
      })

    return () => {
      activo = false
    }
  }, [obtenerDatosCatalogo])

  const limpiarMensajes = () => {
    setErrors({})
    setStatus('idle')
    setServerMessage('')
    setConfirmacionPendiente(false)
  }

  const cambiarModo = (modo) => {
    setForm({
      ...INITIAL_FORM,
      modo,
      categoriaModo: modo === 'nuevo' ? 'nueva' : 'existente',
      categoria: { ...CATEGORIA_VACIA },
      producto: { ...PRODUCTO_VACIO },
    })
    setVariantes([nuevaVariante()])
    setVariantesOriginales([])
    setVariantesEliminadas([])
    setImagenFallida('')
    limpiarMensajes()
  }

  const cambiarCategoriaModo = (categoriaModo) => {
    setForm((current) => {
      const categoria = buscarCategoria(catalogo.categorias, current.categoriaId)

      if (categoriaModo === 'editar' && categoria) {
        return {
          ...current,
          categoriaModo,
          categoria: {
            nombre: categoria.nombre || '',
            descripcion: categoria.descripcion || '',
          },
        }
      }

      if (categoriaModo === 'nueva') {
        return { ...current, categoriaModo, categoria: { ...CATEGORIA_VACIA } }
      }

      return { ...current, categoriaModo }
    })
    limpiarMensajes()
  }

  const cambiarEliminarTipo = (eliminarTipo) => {
    setForm((current) => ({
      ...current,
      eliminarTipo,
      productoId: '',
      varianteId: '',
      categoriaId: '',
    }))
    limpiarMensajes()
  }

  const handleEliminarChange = (event) => {
    const { id, value } = event.target

    setForm((current) => {
      if (id === 'categoriaEliminarId') return { ...current, categoriaId: value }
      if (id === 'varianteEliminarId') return { ...current, varianteId: value }
      return { ...current, productoId: value, varianteId: '' }
    })
    setErrors((current) => ({
      ...current,
      categoriaEliminarId: undefined,
      productoEliminarId: undefined,
      varianteProductoId: undefined,
      varianteEliminarId: undefined,
      eliminar: undefined,
    }))
    setStatus('idle')
    setConfirmacionPendiente(false)
  }

  const handleChange = (event) => {
    const { id, value } = event.target

    if (id === 'categoriaId') {
      setForm((current) => {
        const categoria = current.categoriaModo === 'editar'
          ? buscarCategoria(catalogo.categorias, value)
          : null

        return {
          ...current,
          categoriaId: value,
          ...(categoria
            ? {
              categoria: {
                nombre: categoria.nombre || '',
                descripcion: categoria.descripcion || '',
              },
            }
            : {}),
        }
      })
      setErrors((current) => ({
        ...current,
        categoriaId: undefined,
        'cat-nombre': undefined,
        'cat-descripcion': undefined,
      }))
    } else if (id.startsWith('cat-')) {
      const campo = id.slice(4)
      setForm((current) => ({
        ...current,
        categoria: { ...current.categoria, [campo]: value },
      }))
      setErrors((current) => ({ ...current, [id]: undefined }))
    } else {
      setForm((current) => ({
        ...current,
        producto: { ...current.producto, [id]: value },
      }))
      setErrors((current) => ({ ...current, [id]: undefined }))
    }

    if (status !== 'idle') setStatus('idle')
  }

  const cargarProducto = (productoId) => {
    const producto = catalogo.productos.find((item) => String(item.idProducto) === String(productoId))
    if (!producto) return

    const categoria = buscarCategoria(catalogo.categorias, producto.idCategoria)
    const filas = catalogo.variantes
      .filter((variante) => Number(variante.idProducto) === Number(producto.idProducto))
      .map((variante) => nuevaVariante({
        idVariante: variante.idVariante,
        talla: variante.talla || 'M',
        color: variante.color || '',
        stock: String(variante.stock ?? 0),
      }))

    setForm({
      modo: 'editar',
      productoId: String(producto.idProducto),
      categoriaModo: 'existente',
      categoriaId: String(producto.idCategoria ?? ''),
      categoria: categoria
        ? { nombre: categoria.nombre || '', descripcion: categoria.descripcion || '' }
        : { ...CATEGORIA_VACIA },
      producto: {
        nombre: producto.nombre || '',
        precio: String(producto.precio ?? ''),
        gramajeGsm: String(producto.gramajeGsm ?? ''),
        rutaImagen: producto.rutaImagen || '',
      },
    })
    setVariantes(filas.length > 0 ? filas : [nuevaVariante()])
    setVariantesOriginales(filas.map((variante) => ({
      idVariante: variante.idVariante,
      talla: variante.talla,
      color: variante.color,
      stock: variante.stock,
    })))
    setVariantesEliminadas([])
    limpiarMensajes()
  }

  const handleVarianteChange = (key, campo, valor) => {
    setVariantes((current) => current.map((variante) => (
      variante.key === key ? { ...variante, [campo]: valor } : variante
    )))
    setErrors((current) => ({
      ...current,
      [`${campo}-${key}`]: undefined,
      variantes: undefined,
    }))
    if (status !== 'idle') setStatus('idle')
  }

  const handleVarianteRemove = (key) => {
    const eliminada = variantes.find((variante) => variante.key === key)
    if (eliminada?.idVariante) {
      setVariantesEliminadas((current) => [...current, eliminada.idVariante])
    }
    setVariantes((current) => current.filter((variante) => variante.key !== key))
  }

  const handleVarianteAdd = () => {
    setVariantes((current) => [...current, nuevaVariante()])
  }

  const recargarCatalogo = async () => {
    try {
      setCatalogo(await obtenerDatosCatalogo())
      setEstadoCatalogo('listo')
      setErrorCatalogo('')
    } catch (fallo) {
      setErrorCatalogo(fallo.message || 'No fue posible recargar el catálogo.')
      setEstadoCatalogo('error')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.modo === 'eliminar') {
      const nextErrors = validarEliminacion(form, catalogo)
      setErrors(nextErrors)
      setConfirmacionPendiente(Object.keys(nextErrors).length === 0)
      setStatus('idle')
      setServerMessage('')
      return
    }

    const nextErrors = validarFormulario(form, variantes)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    setServerMessage('')

    try {
      let idCategoria = form.categoriaId ? Number(form.categoriaId) : null
      const nombreCategoria = form.categoria.nombre.trim()
      const descripcionCategoria = form.categoria.descripcion.trim()

      if (form.categoriaModo === 'nueva') {
        const categoriaCreada = await crearCategoria({
          nombre: nombreCategoria,
          descripcion: descripcionCategoria,
        })
        idCategoria = Number(categoriaCreada?.idCategoria)
      } else if (form.categoriaModo === 'editar') {
        const original = buscarCategoria(catalogo.categorias, form.categoriaId)
        const huboCambios = original
          && (nombreCategoria !== (original.nombre || '') || descripcionCategoria !== (original.descripcion || ''))

        if (huboCambios) {
          await actualizarCategoria(idCategoria, {
            nombre: nombreCategoria,
            descripcion: descripcionCategoria,
          })
        }
      }

      if (!Number.isInteger(idCategoria)) {
        throw new Error('No fue posible resolver la categoría del producto.')
      }

      const datosProducto = {
        nombre: form.producto.nombre.trim(),
        precio: Number(form.producto.precio),
        gramajeGsm: Number(form.producto.gramajeGsm),
        idCategoria,
        rutaImagen: form.producto.rutaImagen.trim(),
      }

      let idProducto
      if (form.modo === 'editar') {
        idProducto = Number(form.productoId)
        await actualizarProducto(idProducto, datosProducto)
      } else {
        const productoCreado = await crearProducto(datosProducto)
        idProducto = Number(productoCreado?.idProducto)
      }

      if (!Number.isInteger(idProducto)) {
        throw new Error('No fue posible resolver el producto guardado.')
      }

      const variantesGuardadas = []

      if (form.modo === 'editar') {
        for (const id of variantesEliminadas) {
          await eliminarVariante(id)
        }
      }

      for (const variante of variantes) {
        const datosVariante = {
          idProducto,
          talla: variante.talla,
          color: variante.color.trim(),
          stock: Number(variante.stock),
        }

        if (form.modo === 'editar' && variante.idVariante) {
          const original = variantesOriginales.find((item) => Number(item.idVariante) === Number(variante.idVariante))
          const sinCambios = original
            && original.talla === datosVariante.talla
            && original.color === datosVariante.color
            && Number(original.stock) === datosVariante.stock

          if (sinCambios) {
            variantesGuardadas.push({ ...variante, idVariante: Number(variante.idVariante) })
            continue
          }
          await actualizarVariante(variante.idVariante, datosVariante)
          variantesGuardadas.push({ ...variante, idVariante: Number(variante.idVariante) })
        } else {
          const varianteCreada = await crearVariante(datosVariante)
          variantesGuardadas.push({ ...variante, idVariante: Number(varianteCreada?.idVariante) })
        }
      }

      setVariantes((current) => current.map((variante) => {
        const guardada = variantesGuardadas.find((item) => item.key === variante.key)
        return guardada ? { ...variante, idVariante: guardada.idVariante } : variante
      }))
      setVariantesOriginales(variantesGuardadas.map((variante) => ({
        idVariante: variante.idVariante,
        talla: variante.talla,
        color: variante.color.trim(),
        stock: String(variante.stock),
      })))
      setVariantesEliminadas([])

      setStatus('success')
      setServerMessage(form.modo === 'editar'
        ? 'Producto actualizado correctamente.'
        : 'Producto registrado correctamente.')
    } catch (fallo) {
      setStatus('error')
      setServerMessage(fallo.status ? describeCatalogoError(fallo) : fallo.message || describeCatalogoError(fallo))
    }
  }

  const confirmarEliminacion = async () => {
    if (status === 'loading') return

    const plan = obtenerPlanEliminacion(form, catalogo)
    if (plan.bloqueadas.length > 0) {
      setErrors(validarEliminacion(form, catalogo))
      setConfirmacionPendiente(false)
      return
    }

    setStatus('loading')
    setServerMessage('')

    try {
      for (const id of plan.variantes) {
        await eliminarVariante(id)
      }
      for (const id of plan.productos) {
        await eliminarProducto(id)
      }
      for (const id of plan.categorias) {
        await eliminarCategoria(id)
      }

      await recargarCatalogo()
      setForm((current) => ({ ...current, productoId: '', varianteId: '', categoriaId: '' }))
      setConfirmacionPendiente(false)
      setStatus('success')
      setServerMessage('Eliminación completada correctamente.')
    } catch (fallo) {
      setStatus('error')
      setServerMessage(fallo.status ? describeCatalogoError(fallo) : fallo.message || describeCatalogoError(fallo))
      setConfirmacionPendiente(false)
      await recargarCatalogo()
    }
  }

  const cancelarEliminacion = () => {
    setConfirmacionPendiente(false)
    setErrors({})
    setStatus('idle')
    setServerMessage('')
  }

  const rutaImagen = normalizarRutaImagen(form.producto.rutaImagen)
  const cargando = status === 'loading'
  const seleccionBloqueada = estadoCatalogo !== 'listo' || cargando
  const planEliminacion = form.modo === 'eliminar'
    ? obtenerPlanEliminacion(form, catalogo)
    : PLAN_VACIO
  const idsVariantesEnPedido = new Set(
    (catalogo.detallesPedido || []).map((detalle) => Number(detalle.idVariante)),
  )
  const variantesDelProducto = form.productoId
    ? catalogo.variantes.filter((variante) => Number(variante.idProducto) === Number(form.productoId))
    : []

  return (
    <form className="new-product-form" noValidate onSubmit={handleSubmit}>
      <div className="sizes modo">
        <div className="sizes-head">
          <span>MODO DE OPERACIÓN</span>
          <b>{ETIQUETAS_MODO[form.modo]}</b>
        </div>
        <div className="sizes-grid tres">
          <input
            id="modo-nuevo"
            type="radio"
            name="modo"
            checked={form.modo === 'nuevo'}
            onChange={() => cambiarModo('nuevo')}
            disabled={cargando}
          />
          <label htmlFor="modo-nuevo">NUEVO PRODUCTO</label>
          <input
            id="modo-editar"
            type="radio"
            name="modo"
            checked={form.modo === 'editar'}
            onChange={() => cambiarModo('editar')}
            disabled={cargando}
          />
          <label htmlFor="modo-editar">EDITAR PRODUCTO</label>
          <input
            id="modo-eliminar"
            type="radio"
            name="modo"
            checked={form.modo === 'eliminar'}
            onChange={() => cambiarModo('eliminar')}
            disabled={cargando}
          />
          <label htmlFor="modo-eliminar">ELIMINAR PRODUCTO</label>
        </div>
      </div>

      {form.modo === 'eliminar' && (
        <section className="panel bloque delete-panel">
          <div className="panel-head">
            <h2><i></i>[01] ELIMINACIÓN</h2>
            <span>[{ETIQUETAS_ELIMINAR[form.eliminarTipo]}]</span>
          </div>

          {estadoCatalogo === 'error' && (
            <p className="form-message error" role="alert">{errorCatalogo}</p>
          )}
          {estadoCatalogo === 'cargando' && <p className="modo-nota">CARGANDO CATÁLOGO...</p>}

          <div className="sizes delete-tipo">
            <div className="sizes-head">
              <span>TIPO DE REGISTRO</span>
              <b>[{ETIQUETAS_ELIMINAR[form.eliminarTipo]}]</b>
            </div>
            <div className="sizes-grid tres">
              <input
                id="eliminar-producto"
                type="radio"
                name="eliminarTipo"
                checked={form.eliminarTipo === 'producto'}
                onChange={() => cambiarEliminarTipo('producto')}
                disabled={seleccionBloqueada}
              />
              <label htmlFor="eliminar-producto">PRODUCTO</label>
              <input
                id="eliminar-categoria"
                type="radio"
                name="eliminarTipo"
                checked={form.eliminarTipo === 'categoria'}
                onChange={() => cambiarEliminarTipo('categoria')}
                disabled={seleccionBloqueada}
              />
              <label htmlFor="eliminar-categoria">CATEGORÍA</label>
              <input
                id="eliminar-variante"
                type="radio"
                name="eliminarTipo"
                checked={form.eliminarTipo === 'variante'}
                onChange={() => cambiarEliminarTipo('variante')}
                disabled={seleccionBloqueada}
              />
              <label htmlFor="eliminar-variante">VARIANTE</label>
            </div>
          </div>

          {form.eliminarTipo === 'categoria' && (
            <div className="field">
              <label htmlFor="categoriaEliminarId">CATEGORÍA A ELIMINAR <em>•</em></label>
              <select
                id="categoriaEliminarId"
                value={form.categoriaId}
                onChange={handleEliminarChange}
                disabled={seleccionBloqueada}
              >
                <option value="">Seleccionar...</option>
                {catalogo.categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.nombre} [#{categoria.idCategoria}]
                  </option>
                ))}
              </select>
              {errors.categoriaEliminarId && <p className="field-error">{errors.categoriaEliminarId}</p>}
            </div>
          )}

          {form.eliminarTipo === 'producto' && (
            <div className="field">
              <label htmlFor="productoEliminarId">PRODUCTO A ELIMINAR <em>•</em></label>
              <select
                id="productoEliminarId"
                value={form.productoId}
                onChange={handleEliminarChange}
                disabled={seleccionBloqueada}
              >
                <option value="">Seleccionar...</option>
                {catalogo.productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombre} [#{producto.idProducto}]
                  </option>
                ))}
              </select>
              {errors.productoEliminarId && <p className="field-error">{errors.productoEliminarId}</p>}
            </div>
          )}

          {form.eliminarTipo === 'variante' && (
            <>
              <div className="field">
                <label htmlFor="varianteProductoId">PRODUCTO DE LA VARIANTE <em>•</em></label>
                <select
                  id="varianteProductoId"
                  value={form.productoId}
                  onChange={handleEliminarChange}
                  disabled={seleccionBloqueada}
                >
                  <option value="">Seleccionar...</option>
                  {catalogo.productos.map((producto) => (
                    <option key={producto.idProducto} value={producto.idProducto}>
                      {producto.nombre} [#{producto.idProducto}]
                    </option>
                  ))}
                </select>
                {errors.varianteProductoId && <p className="field-error">{errors.varianteProductoId}</p>}
              </div>
              <div className="field">
                <label htmlFor="varianteEliminarId">VARIANTE A ELIMINAR <em>•</em></label>
                <select
                  id="varianteEliminarId"
                  value={form.varianteId}
                  onChange={handleEliminarChange}
                  disabled={seleccionBloqueada || !form.productoId}
                >
                  <option value="">Seleccionar...</option>
                  {variantesDelProducto.map((variante) => (
                    <option key={variante.idVariante} value={variante.idVariante}>
                      {etiquetaVariante(variante)}
                      {idsVariantesEnPedido.has(Number(variante.idVariante)) ? ' [EN PEDIDO]' : ''}
                    </option>
                  ))}
                </select>
                {errors.varianteEliminarId && <p className="field-error">{errors.varianteEliminarId}</p>}
              </div>
              {form.productoId && variantesDelProducto.length === 0 && (
                <p className="modo-nota">ESTE PRODUCTO NO TIENE VARIANTES.</p>
              )}
            </>
          )}

          <div className="delete-summary">
            <span>RESUMEN DEL BORRADO</span>
            <p>
              {planEliminacion.categorias.length} categoría(s) · {planEliminacion.productos.length} producto(s) · {planEliminacion.variantes.length} variante(s)
            </p>
            {planEliminacion.bloqueadas.length > 0 && (
              <p className="delete-warning">
                {planEliminacion.bloqueadas.map(etiquetaVariante).join(', ')} en pedidos existentes.
              </p>
            )}
          </div>

          {errors.eliminar && <p className="form-message error" role="alert">{errors.eliminar}</p>}

          {confirmacionPendiente && (
            <div className="delete-confirm" role="alertdialog" aria-labelledby="titulo-confirmar-eliminacion">
              <p id="titulo-confirmar-eliminacion">CONFIRMAR ELIMINACIÓN</p>
              <p>Esta acción no se puede deshacer.</p>
              <div className="delete-confirm-actions">
                <button type="button" className="submit" onClick={confirmarEliminacion} disabled={cargando}>
                  CONFIRMAR ELIMINACIÓN
                </button>
                <button type="button" className="submit submit-secondary" onClick={cancelarEliminacion} disabled={cargando}>
                  CANCELAR
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {form.modo !== 'eliminar' && (
        <>
          <section className="panel bloque">
            <div className="panel-head">
              <h2><i></i>[01] CATEGORÍA</h2>
          <span>[KULT // LAB]</span>
        </div>

        {estadoCatalogo === 'error' && (
          <p className="form-message error" role="alert">{errorCatalogo}</p>
        )}

        <div className="sizes categoria-modo">
          <div className="sizes-head">
            <span>TIPO DE GESTIÓN</span>
            <b>[{form.categoriaModo.toUpperCase()}]</b>
          </div>
          <div className="sizes-grid tres">
            <input
              id="cat-modo-nueva"
              type="radio"
              name="categoriaModo"
              checked={form.categoriaModo === 'nueva'}
              onChange={() => cambiarCategoriaModo('nueva')}
              disabled={cargando}
            />
            <label htmlFor="cat-modo-nueva">NUEVA</label>
            <input
              id="cat-modo-existente"
              type="radio"
              name="categoriaModo"
              checked={form.categoriaModo === 'existente'}
              onChange={() => cambiarCategoriaModo('existente')}
              disabled={cargando}
            />
            <label htmlFor="cat-modo-existente">EXISTENTE</label>
            <input
              id="cat-modo-editar"
              type="radio"
              name="categoriaModo"
              checked={form.categoriaModo === 'editar'}
              onChange={() => cambiarCategoriaModo('editar')}
              disabled={cargando}
            />
            <label htmlFor="cat-modo-editar">EDITAR</label>
          </div>
        </div>

        {form.categoriaModo !== 'nueva' && (
          <div className="field">
            <label htmlFor="categoriaId">
              CATEGORÍA {form.categoriaModo === 'editar' ? 'A EDITAR ' : 'DEL PRODUCTO'} <em>•</em>
            </label>
            <select
              id="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              disabled={seleccionBloqueada}
            >
              <option value="">Seleccionar...</option>
              {catalogo.categorias.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && <p className="field-error">{errors.categoriaId}</p>}
          </div>
        )}

        {form.categoriaModo !== 'existente' && (
          <>
            <div className="field">
              <label htmlFor="cat-nombre">NOMBRE DE CATEGORÍA <em>•</em></label>
              <input
                id="cat-nombre"
                type="text"
                placeholder="Ej. Oversized"
                maxLength={45}
                value={form.categoria.nombre}
                onChange={handleChange}
                disabled={cargando}
              />
              {errors['cat-nombre'] && <p className="field-error">{errors['cat-nombre']}</p>}
            </div>
            <div className="field">
              <label htmlFor="cat-descripcion">DESCRIPCIÓN</label>
              <input
                id="cat-descripcion"
                type="text"
                placeholder="Corte caído, algodón pesado..."
                maxLength={70}
                value={form.categoria.descripcion}
                onChange={handleChange}
                disabled={cargando}
              />
              {errors['cat-descripcion'] && <p className="field-error">{errors['cat-descripcion']}</p>}
            </div>
          </>
        )}

        {estadoCatalogo === 'cargando' && <p className="modo-nota">CARGANDO CATEGORÍAS DEL CATÁLOGO...</p>}
      </section>

      <section className="panel bloque">
        <div className="panel-head">
          <h2><i></i>[02] PRODUCTO</h2>
          <span>[FICHA TÉCNICA]</span>
        </div>

        {form.modo === 'editar' && (
          <div className="field">
            <label htmlFor="productoId">PRODUCTO A EDITAR <em>•</em></label>
            <select
              id="productoId"
              value={form.productoId}
              onChange={(event) => cargarProducto(event.target.value)}
              disabled={seleccionBloqueada}
            >
              <option value="">Seleccionar...</option>
              {catalogo.productos.map((producto) => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombre} [#{producto.idProducto}]
                </option>
              ))}
            </select>
            {errors.productoId && <p className="field-error">{errors.productoId}</p>}
          </div>
        )}

        <div className="field">
          <label htmlFor="nombre">NOMBRE DEL PRODUCTO <em>•</em></label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej. Camiseta raw oversized"
            maxLength={150}
            value={form.producto.nombre}
            onChange={handleChange}
            disabled={cargando}
          />
          {errors.nombre && <p className="field-error">{errors.nombre}</p>}
        </div>

        <div className="row two">
          <div className="field">
            <label htmlFor="precio">PRECIO <em>•</em></label>
            <div className="phone">
              <span>COP</span>
              <input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="50000"
                value={form.producto.precio}
                onChange={handleChange}
                disabled={cargando}
              />
            </div>
            {errors.precio && <p className="field-error">{errors.precio}</p>}
          </div>
          <div className="field">
            <label htmlFor="gramajeGsm">GRAMAJE (GSM) <em>•</em></label>
            <input
              id="gramajeGsm"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="300"
              value={form.producto.gramajeGsm}
              onChange={handleChange}
              disabled={cargando}
            />
            {errors.gramajeGsm && <p className="field-error">{errors.gramajeGsm}</p>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="rutaImagen">RUTA DE IMAGEN</label>
          <input
            id="rutaImagen"
            type="text"
            placeholder="/img/colection/negra_estampada.png"
            maxLength={200}
            value={form.producto.rutaImagen}
            onChange={handleChange}
            disabled={cargando}
          />
          {errors.rutaImagen && <p className="field-error">{errors.rutaImagen}</p>}
        </div>

        <div className="image-preview">
          {rutaImagen && imagenFallida !== rutaImagen ? (
            <img src={rutaImagen} alt="Vista previa del producto" onError={() => setImagenFallida(rutaImagen)} />
          ) : (
            <span className="ph mono">SIN IMAGEN // PREVIEW</span>
          )}
        </div>
      </section>

      <section className="panel bloque">
        <div className="panel-head">
          <h2><i></i>[03] VARIANTES</h2>
          <span>[{String(variantes.length).padStart(2, '0')} FILAS]</span>
        </div>
        <p className="modo-nota">TALLA / COLOR / STOCK DISPONIBLE POR CADA REFERENCIA.</p>
        <VariantEditor
          variantes={variantes}
          errors={errors}
          onChange={handleVarianteChange}
          onRemove={handleVarianteRemove}
          onAdd={handleVarianteAdd}
          disabled={cargando}
        />
      </section>
        </>
      )}

      {status === 'error' && (
        <p className="form-message error" role="alert">{serverMessage}</p>
      )}
      {status === 'success' && (
        <p className="form-message success" role="status">
          {serverMessage} <Link to="/coleccion">[VER EN COLECCIÓN]</Link>
        </p>
      )}

      <button
        className="submit"
        type="submit"
        disabled={cargando || status === 'success' || (form.modo === 'eliminar' && confirmacionPendiente)}
      >
        {cargando
          ? (form.modo === 'eliminar'
            ? 'ELIMINANDO REGISTROS...'
            : form.modo === 'editar'
              ? 'ACTUALIZANDO PRODUCTO...'
              : 'REGISTRANDO PRODUCTO...')
          : form.modo === 'eliminar'
            ? 'REVISAR ELIMINACIÓN'
            : form.modo === 'editar'
              ? 'GUARDAR CAMBIOS'
              : 'REGISTRAR PRODUCTO'}
        <span>→</span>
      </button>
    </form>
  )
}
