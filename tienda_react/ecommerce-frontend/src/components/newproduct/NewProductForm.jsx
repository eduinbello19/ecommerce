import { useEffect, useState } from 'react'
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
  eliminarVariante,
  obtenerCatalogo,
} from '../../services/catalogoService'
import { normalizarRutaImagen } from '../../utils/catalogo'
import { nuevaVariante, validarFormulario } from '../../utils/nuevoProducto'

const CATALOGO_VACIO = { categorias: [], productos: [], variantes: [] }
const CATEGORIA_VACIA = { nombre: '', descripcion: '' }
const PRODUCTO_VACIO = { nombre: '', precio: '', gramajeGsm: '', rutaImagen: '' }
const INITIAL_FORM = {
  modo: 'nuevo',
  productoId: '',
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

  useEffect(() => {
    let activo = true

    obtenerCatalogo()
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
  }, [])

  const limpiarMensajes = () => {
    setErrors({})
    setStatus('idle')
    setServerMessage('')
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

  const handleSubmit = async (event) => {
    event.preventDefault()

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

  const rutaImagen = normalizarRutaImagen(form.producto.rutaImagen)
  const cargando = status === 'loading'
  const seleccionBloqueada = estadoCatalogo !== 'listo' || cargando

  return (
    <form className="new-product-form" noValidate onSubmit={handleSubmit}>
      <div className="sizes modo">
        <div className="sizes-head">
          <span>MODO DE OPERACIÓN</span>
          <b>{form.modo === 'nuevo' ? '[ALTA]' : '[EDICIÓN]'}</b>
        </div>
        <div className="sizes-grid dos">
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
        </div>
      </div>

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

      {status === 'error' && (
        <p className="form-message error" role="alert">{serverMessage}</p>
      )}
      {status === 'success' && (
        <p className="form-message success" role="status">
          {serverMessage} <Link to="/coleccion">[VER EN COLECCIÓN]</Link>
        </p>
      )}

      <button className="submit" type="submit" disabled={cargando || status === 'success'}>
        {cargando
          ? (form.modo === 'editar' ? 'ACTUALIZANDO PRODUCTO...' : 'REGISTRANDO PRODUCTO...')
          : (form.modo === 'editar' ? 'GUARDAR CAMBIOS' : 'REGISTRAR PRODUCTO')}
        <span>→</span>
      </button>
    </form>
  )
}
