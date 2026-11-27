import { Link } from 'react-router-dom'
import { formatearPrecio } from '../../utils/catalogo'

export default function CartSummary({ items, open, onRemove = () => {} }) {
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
              <div className="cart-item-info">
                <span>{item.nombre}</span>
                <br />
                <small>Talla: {item.talla}</small>
              </div>
              <div className="cart-item-actions">
                <b>{formatearPrecio(item.precio)}</b>
                <button
                  type="button"
                  className="cart-remove"
                  aria-label={`Quitar ${item.nombre} talla ${item.talla}`}
                  onClick={() => onRemove(indice)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 7h16" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M6 7l1 13h10l1-13" />
                    <path d="M9 7V4h6v3" />
                  </svg>
                </button>
              </div>
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
