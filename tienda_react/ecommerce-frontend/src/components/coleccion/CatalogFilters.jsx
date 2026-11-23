import { colorSwatch } from '../../utils/catalogo'

const GRAMAJES = [
  { id: 'heavy', etiqueta: 'Heavyweight (280+ GSM)', em: 'CORE', destacado: true },
  { id: 'ultra', etiqueta: 'Ultra-Heavy (350 GSM Raw)', em: 'SPEC', destacado: false },
  { id: 'mid', etiqueta: 'Midweight (220 GSM Summer)', em: 'LIGHT', destacado: false },
]

export default function CatalogFilters({
  abierto,
  categorias,
  categoriasSeleccionadas,
  conteoPorCategoria,
  onToggleCategoria,
  gramajesSeleccionados,
  onToggleGramaje,
  tallas,
  tallaSeleccionada,
  tallasSinStock,
  onSeleccionarTalla,
  colores,
  coloresSeleccionados,
  onToggleColor,
  onLimpiar,
}) {
  return (
    <aside className={`filters ${abierto ? 'open' : ''}`} id="filters" aria-label="Filtros de catálogo">
      <div className="fh">
        <h2 className="mono">☰ Filtros sistema</h2>
        <button type="button" onClick={onLimpiar}>[Limpiar]</button>
      </div>

      <div className="grp">
        <h3>Patrón &amp; corte <span>[{String(categorias.length).padStart(2, '0')}]</span></h3>
        {categorias.map((categoria) => (
          <label className="opt" key={categoria.idCategoria}>
            <input
              type="checkbox"
              checked={categoriasSeleccionadas.includes(categoria.idCategoria)}
              onChange={() => onToggleCategoria(categoria.idCategoria)}
            />
            {categoria.nombre}
            <em>{String(conteoPorCategoria[categoria.idCategoria] || 0).padStart(2, '0')}</em>
          </label>
        ))}
      </div>

      <div className="grp">
        <h3>Gramaje textil <span>GSM</span></h3>
        {GRAMAJES.map((gramaje) => (
          <label className="opt" key={gramaje.id}>
            <input
              type="checkbox"
              checked={gramajesSeleccionados.includes(gramaje.id)}
              onChange={() => onToggleGramaje(gramaje.id)}
            />
            {gramaje.etiqueta}
            <em className={gramaje.destacado ? 'l' : ''}>{gramaje.em}</em>
          </label>
        ))}
      </div>

      <div className="grp">
        <h3>Dimensión // Talla <span className="subrayado">GUÍA</span></h3>
        <div className="tallas" id="tallas">
          {tallas.map((talla) => (
            <button
              type="button"
              key={talla}
              aria-pressed={talla === tallaSeleccionada}
              disabled={tallasSinStock.includes(talla)}
              onClick={() => onSeleccionarTalla(talla)}
            >
              {talla}
            </button>
          ))}
        </div>
      </div>

      <div className="grp">
        <h3>Pigmento</h3>
        {colores.map((color) => (
          <label className={`opt pig ${coloresSeleccionados.includes(color) ? 'seleccionado' : ''}`} key={color}>
            <i className="sw" style={{ background: colorSwatch(color) }} />
            <input
              type="checkbox"
              checked={coloresSeleccionados.includes(color)}
              onChange={() => onToggleColor(color)}
            />
            {color}
          </label>
        ))}
      </div>

      <div className="grp">
        <h3>Estado de lanzamiento</h3>
        <label className="opt">
          <input type="radio" name="est" checked readOnly />
          En Stock (Envío 24h Colombia)
        </label>
        <label className="opt deshabilitado">
          <input type="radio" name="est" disabled />
          Pre-order Drop 05
        </label>
        <label className="opt deshabilitado">
          <input type="radio" name="est" disabled />
          Exclusivo Online Lab
        </label>
      </div>

      <div className="dens">
        <div className="t mono"><span>Densidad media drop</span><b>310 GSM</b></div>
        <div className="bar"><i /></div>
        <p>Nuestros tejidos resisten más de 200 lavados sin deformación de cuello o pérdida de opacidad.</p>
      </div>
    </aside>
  )
}
