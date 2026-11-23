import { useEffect, useMemo, useState } from 'react'
import '../styles/coleccion.css'
import ColeccionHeader from '../components/coleccion/ColeccionHeader'
import ColeccionFooter from '../components/coleccion/ColeccionFooter'
import CatalogFilters from '../components/coleccion/CatalogFilters'
import ActiveFilters from '../components/coleccion/ActiveFilters'
import ProductCard from '../components/coleccion/ProductCard'
import Specs from '../components/coleccion/Specs'
import { obtenerCatalogo } from '../services/catalogoService'
import { agruparVariantesPorProducto, calcularStockTotal, obtenerColoresUnicos } from '../utils/catalogo'

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const CATALOGO_VACIO = { categorias: [], productos: [], variantes: [] }

export default function ColeccionPage() {
  const [catalogo, setCatalogo] = useState(CATALOGO_VACIO)
  const [estadoCarga, setEstadoCarga] = useState('cargando')
  const [error, setError] = useState('')
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([])
  const [gramajesSeleccionados, setGramajesSeleccionados] = useState([])
  const [coloresSeleccionados, setColoresSeleccionados] = useState([])
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M')
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [orden, setOrden] = useState('recientes')
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  useEffect(() => {
    let activo = true

    obtenerCatalogo()
      .then((datos) => {
        if (!activo) return
        setCatalogo(datos)
        setEstadoCarga('listo')
      })
      .catch((fallo) => {
        if (!activo) return
        setError(fallo.message || 'No fue posible cargar el catálogo.')
        setEstadoCarga('error')
      })

    return () => {
      activo = false
    }
  }, [])

  const { categorias, productos, variantes } = catalogo

  const variantesPorProducto = useMemo(
    () => agruparVariantesPorProducto(variantes),
    [variantes],
  )

  const categoriasPorId = useMemo(
    () => new Map(categorias.map((categoria) => [categoria.idCategoria, categoria])),
    [categorias],
  )

  const conteoPorCategoria = useMemo(() => {
    return productos.reduce((conteo, producto) => {
      conteo[producto.idCategoria] = (conteo[producto.idCategoria] || 0) + 1
      return conteo
    }, {})
  }, [productos])

  const colores = useMemo(() => obtenerColoresUnicos(variantes), [variantes])

  const tallasSinStock = useMemo(() => {
    return TALLAS.filter((talla) => !variantes.some((variante) => variante.talla === talla && Number(variante.stock) > 0))
  }, [variantes])

  const tallaActiva = tallasSinStock.includes(tallaSeleccionada)
    ? TALLAS.find((talla) => !tallasSinStock.includes(talla)) || ''
    : tallaSeleccionada

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const resultado = productos.filter((producto) => {
      if (categoriasSeleccionadas.length > 0 && !categoriasSeleccionadas.includes(producto.idCategoria)) {
        return false
      }

      if (gramajesSeleccionados.length > 0) {
        const gramaje = Number(producto.gramajeGsm || 0)
        const coincideGramaje = gramajesSeleccionados.some((gramajeId) => {
          if (gramajeId === 'heavy') return gramaje >= 280
          if (gramajeId === 'ultra') return gramaje >= 350
          return gramaje < 280
        })
        if (!coincideGramaje) return false
      }

      if (coloresSeleccionados.length > 0) {
        const coloresProducto = (variantesPorProducto.get(producto.idProducto) || []).map((variante) => variante.color)
        if (!coloresSeleccionados.some((color) => coloresProducto.includes(color))) return false
      }

      if (texto && !producto.nombre.toLowerCase().includes(texto)) return false

      return true
    })

    return resultado.sort((primero, segundo) => {
      if (orden === 'precio-asc') return Number(primero.precio) - Number(segundo.precio)
      if (orden === 'precio-desc') return Number(segundo.precio) - Number(primero.precio)
      if (orden === 'vendidos') {
        return calcularStockTotal(variantesPorProducto.get(segundo.idProducto))
          - calcularStockTotal(variantesPorProducto.get(primero.idProducto))
      }
      return Number(segundo.idProducto) - Number(primero.idProducto)
    })
  }, [
    busqueda,
    categoriasSeleccionadas,
    coloresSeleccionados,
    gramajesSeleccionados,
    orden,
    productos,
    variantesPorProducto,
  ])

  const cantidadFiltros = categoriasSeleccionadas.length
    + gramajesSeleccionados.length
    + coloresSeleccionados.length
    + (tallaActiva ? 1 : 0)

  const alternarValor = (lista, valor, setter) => {
    setter(lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor])
  }

  const limpiarFiltros = () => {
    setCategoriasSeleccionadas([])
    setGramajesSeleccionados([])
    setColoresSeleccionados([])
    setTallaSeleccionada(TALLAS.find((talla) => !tallasSinStock.includes(talla)) || 'M')
    setBusqueda('')
    setOrden('recientes')
  }

  const seleccionarCategoria = (idCategoria) => {
    setCategoriasSeleccionadas(idCategoria === 'todos' ? [] : [idCategoria])
  }

  const agregarAlCarrito = (producto, variante) => {
    if (!variante || Number(variante.stock) <= 0) return

    setCarrito((items) => [
      ...items,
      {
        idVariante: variante.idVariante,
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        talla: variante.talla,
        precio: producto.precio,
      },
    ])
    setCarritoAbierto(true)
  }

  return (
    <div className="coleccion-page">
      <ColeccionHeader
        search={busqueda}
        onSearchChange={setBusqueda}
        cart={carrito}
        cartOpen={carritoAbierto}
        onCartToggle={() => setCarritoAbierto((valor) => !valor)}
      />

      <section className="phead">
        <div className="wrap">
          <div className="row">
            <div>
              <p className="eyebrow mono">Catálogo técnico SS25 // Serie 04</p>
              <h1>Colección / Camisetas gráficas &amp; oversized</h1>
            </div>
            <div className="ctrl">
              <div className="mono">Catálogo activo: <b>{productos.length} productos disponibles</b></div>
              <label className="mono">
                Ordenar:
                <select aria-label="Ordenar productos" value={orden} onChange={(event) => setOrden(event.target.value)}>
                  <option value="recientes">Más recientes</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="vendidos">Más vendidos</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="strip mono">
          <div className="wrap">
            <span><span className="a">Algodón orgánico peinado</span> &nbsp;•&nbsp; Serigrafía de alta densidad &nbsp;•&nbsp; Corte arquitectónico caído</span>
            <span>Producción limitada: <b>150 uds / modelo</b></span>
          </div>
        </div>
      </section>

      <main className="wrap" id="catalogo">
        <div className="layout">
          <CatalogFilters
            abierto={filtrosAbiertos}
            categorias={categorias}
            categoriasSeleccionadas={categoriasSeleccionadas}
            conteoPorCategoria={conteoPorCategoria}
            onToggleCategoria={(id) => alternarValor(categoriasSeleccionadas, id, setCategoriasSeleccionadas)}
            gramajesSeleccionados={gramajesSeleccionados}
            onToggleGramaje={(id) => alternarValor(gramajesSeleccionados, id, setGramajesSeleccionados)}
            tallas={TALLAS}
            tallaSeleccionada={tallaActiva}
            tallasSinStock={tallasSinStock}
            onSeleccionarTalla={setTallaSeleccionada}
            colores={colores}
            coloresSeleccionados={coloresSeleccionados}
            onToggleColor={(color) => alternarValor(coloresSeleccionados, color, setColoresSeleccionados)}
            onLimpiar={limpiarFiltros}
          />

          <div>
            <ActiveFilters
              abierto={filtrosAbiertos}
              onToggleFiltros={() => setFiltrosAbiertos((valor) => !valor)}
              cantidadFiltros={cantidadFiltros}
              categorias={categorias}
              categoriasSeleccionadas={categoriasSeleccionadas}
              onSeleccionar={seleccionarCategoria}
            />

            {estadoCarga === 'cargando' && <p className="estado-catalogo mono">Cargando catálogo...</p>}
            {estadoCarga === 'error' && <p className="estado-catalogo error mono">{error}</p>}
            {estadoCarga === 'listo' && productosFiltrados.length === 0 && (
              <p className="estado-catalogo mono">No hay productos para los filtros seleccionados.</p>
            )}

            <div className="grid" id="grid">
              {productosFiltrados.map((producto, indice) => (
                <ProductCard
                  key={producto.idProducto}
                  producto={producto}
                  categoria={categoriasPorId.get(producto.idCategoria)}
                  variantes={variantesPorProducto.get(producto.idProducto) || []}
            tallaSeleccionada={tallaActiva}

                  numero={indice + 1}
                  onComprar={agregarAlCarrito}
                />
              ))}
            </div>

            <div className="more mono">
              <span>Mostrando {productosFiltrados.length} productos filtrables • <b>100% completado</b></span>
              <div className="bar">
                <i style={{ width: `${productos.length ? (productosFiltrados.length / productos.length) * 100 : 0}%` }} />
              </div>
              <button className="btn dark" type="button" disabled>Cargar más camisetas ⌄</button>
              <span style={{ fontSize: '.6rem' }}>Sistema de despacho inmediato // Disponibilidad en tiempo real</span>
            </div>
          </div>
        </div>
      </main>

      <Specs />
      <ColeccionFooter />
    </div>
  )
}
