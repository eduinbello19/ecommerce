import { formatearPrecio, normalizarRutaImagen } from '../../utils/catalogo'

export default function PasarelaSummary({ items, subtotal, envio, total }) {
  return (
    <section className="intro">
      <span className="tag">
        <i></i>
        PROTOCOLO DE COMPRA // CHECKOUT
      </span>

      <h1>
        FINALIZAR<br />
        COMPRA
      </h1>

      <p className="subtitle">// RESUMEN DE TU PEDIDO</p>

      <p className="lead">
        Revisa los productos seleccionados y verifica que la información de tu pedido sea correcta
        antes de continuar con el pago.
      </p>

      <div className="order-card">
        <div className="section-title">
          <h2>RESUMEN DEL PEDIDO</h2>
          <span>ORDEN #0001</span>
        </div>

        {items.map((item, indice) => (
          <article className="product" key={`${item.idVariante || item.nombre}-${indice}`}>
            <div className="product-image">
              {item.rutaImagen ? (
                <img src={normalizarRutaImagen(item.rutaImagen)} alt={item.nombre} />
              ) : (
                <span>KULT</span>
              )}
            </div>

            <div className="product-info">
              <h3>{item.nombre}</h3>
              <p>Color: {item.color || 'No especificado'}</p>
              <p>Talla: {item.talla}</p>
              <p>Cantidad: 1</p>
            </div>

            <strong className="product-price">{formatearPrecio(item.precio)}</strong>
          </article>
        ))}

        <div className="totals">
          <div className="total-line">
            <span>SUBTOTAL</span>
            <span>{formatearPrecio(subtotal)}</span>
          </div>

          <div className="total-line">
            <span>COSTO DE ENVÍO</span>
            <span>{formatearPrecio(envio)}</span>
          </div>

          <div className="total-line final-total">
            <strong>TOTAL A PAGAR</strong>
            <strong>{formatearPrecio(total)} COP</strong>
          </div>
        </div>
      </div>

      <div className="security-note">
        <span className="security-icon">✓</span>
        <p>TU PEDIDO SERÁ VALIDADO ANTES DE REGISTRAR LA TRANSACCIÓN.</p>
      </div>
    </section>
  )
}
