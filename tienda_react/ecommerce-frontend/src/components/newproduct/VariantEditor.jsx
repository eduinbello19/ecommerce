import { COLORES, TALLAS } from '../../utils/nuevoProducto'

export default function VariantEditor({ variantes, errors, onChange, onRemove, onAdd, disabled }) {
  return (
    <div className="variant-editor">
      <datalist id="colores-kult">
        {COLORES.map((color) => <option key={color} value={color} />)}
      </datalist>

      <div className="variant-head mono">
        <span>#</span>
        <span>TALLA</span>
        <span>COLOR</span>
        <span>STOCK</span>
        <span>ACCIÓN</span>
      </div>

      {variantes.map((variante, indice) => (
        <div className="variant-row" key={variante.key} data-estado={variante.idVariante ? 'existente' : 'nueva'}>
          <span className="variant-index">{String(indice + 1).padStart(2, '0')}</span>

          <div className="field">
            <span className="variant-label">TALLA</span>
            <select
              value={variante.talla}
              onChange={(event) => onChange(variante.key, 'talla', event.target.value)}
              disabled={disabled}
              aria-label={`Talla de la variante ${indice + 1}`}
            >
              {TALLAS.map((talla) => <option key={talla} value={talla}>{talla}</option>)}
            </select>
            {errors[`talla-${variante.key}`] && <p className="field-error">{errors[`talla-${variante.key}`]}</p>}
          </div>

          <div className="field">
            <span className="variant-label">COLOR</span>
            <input
              type="text"
              list="colores-kult"
              placeholder="Ej. Negro"
              maxLength={50}
              value={variante.color}
              onChange={(event) => onChange(variante.key, 'color', event.target.value)}
              disabled={disabled}
              aria-label={`Color de la variante ${indice + 1}`}
            />
            {errors[`color-${variante.key}`] && <p className="field-error">{errors[`color-${variante.key}`]}</p>}
          </div>

          <div className="field">
            <span className="variant-label">STOCK</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="0"
              value={variante.stock}
              onChange={(event) => onChange(variante.key, 'stock', event.target.value)}
              disabled={disabled}
              aria-label={`Stock de la variante ${indice + 1}`}
            />
            {errors[`stock-${variante.key}`] && <p className="field-error">{errors[`stock-${variante.key}`]}</p>}
          </div>

          <button
            className="variant-remove"
            type="button"
            onClick={() => onRemove(variante.key)}
            disabled={disabled}
            aria-label={`Quitar variante ${indice + 1}`}
          >
            [QUITAR]
          </button>
        </div>
      ))}

      <button className="variant-add" type="button" onClick={onAdd} disabled={disabled}>
        + AGREGAR VARIANTE
      </button>
      {errors.variantes && <p className="field-error variant-error">{errors.variantes}</p>}
    </div>
  )
}
