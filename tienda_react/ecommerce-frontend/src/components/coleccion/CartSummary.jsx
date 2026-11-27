import { Link } from 'react-router-dom'
import { formatearPrecio } from '../../utils/catalogo'

export default function CartSummary({ items, open }) {
  if (!open) return null

  const total = items.reduce((suma, item) => suma + Number(item.precio || 0), 0)

  return (
    <div id="cart-modal" className="cart-modal mono" role="dialog" aria-label="Resumen de compra">
      <h4>■ RESUMEN DE COMPRA</h4>

      <ul id="lista-carrito">
        {items.length === 0 ? (
          <li className="cart-empty">El carrito está vacío.</li>
        ) : (
          items.map((item, indice) => (
            <li key={`${item.idVariante}-${indice}`} className="cart-item">
              <div>
                <span>{item.nombre}</span>
                <br />
                <small>Talla: {item.talla}</small>
              </div>
              <b>{formatearPrecio(item.precio)}</b>
            </li>
          ))
        )}
      </ul>

      <div className="cart-total">
        <span>TOTAL:</span>
        <span>{formatearPrecio(total)} COP</span>
      </div>

      {items.length > 0 ? (
        <Link className="cart-checkout" to="/pasarela" state={{ items }}>
          CONTINUAR CON EL PAGO <span>→</span>
        </Link>
      ) : (
        <button type="button" className="cart-checkout" disabled>
          CONTINUAR CON EL PAGO <span>→</span>
        </button>
      )}
    </div>
  )
}
