import { Fragment } from 'react'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function SizeSelector({ value, onChange }) {
  return (
    <div className="sizes">
      <div className="sizes-head">
        <span>TALLA HABITUAL DE PREFERENCIA (PRE-RESERVA AUTOMÁTICA)</span>
        <b>[CUPO 1 UNIDAD]</b>
      </div>
      <div className="sizes-grid">
        {SIZES.map((size) => (
          <Fragment key={size}>
            <input
              type="radio"
              name="talla"
              id={`t${size}`}
              value={size}
              checked={value === size}
              onChange={() => onChange(size)}
            />
            <label htmlFor={`t${size}`}>{size}</label>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
