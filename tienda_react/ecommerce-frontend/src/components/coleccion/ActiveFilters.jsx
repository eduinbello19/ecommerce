export default function ActiveFilters({
  abierto,
  onToggleFiltros,
  cantidadFiltros,
  categorias,
  categoriasSeleccionadas,
  onSeleccionar,
}) {
  return (
    <>
      <button
        type="button"
        className="fbtn"
        id="fbtn"
        aria-expanded={abierto}
        aria-controls="filters"
        onClick={onToggleFiltros}
      >
        <span>☰ Filtros sistema</span>
        <span style={{ color: 'var(--lime)' }}>[{String(cantidadFiltros).padStart(2, '0')}]</span>
      </button>

      <div className="active mono">
        <span>Filtros activos:</span>
        <button
          type="button"
          className={`filtro-btn ${categoriasSeleccionadas.length === 0 ? 'active' : ''}`}
          onClick={() => onSeleccionar('todos')}
        >
          Todo
        </button>
        {categorias.map((categoria) => (
          <button
            type="button"
            key={categoria.idCategoria}
            className={`filtro-btn ${categoriasSeleccionadas.length === 1 && categoriasSeleccionadas[0] === categoria.idCategoria ? 'active' : ''}`}
            onClick={() => onSeleccionar(categoria.idCategoria)}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
    </>
  )
}
