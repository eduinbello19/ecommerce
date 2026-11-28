import { useState } from 'react'
import { formatearPrecio, normalizarRutaImagen } from '../../utils/catalogo'

function formatearFecha(valor) {
  if (!valor) return 'FECHA NO DISPONIBLE'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return String(valor)
  return fecha.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}

function ItemImagen({ item }) {
  const [error, setError] = useState(false)
  const ruta = normalizarRutaImagen(item.rutaImagen)

  return (
    <div className="pedido-imagen">
      {ruta && !error ? (
        <img src={ruta} alt={item.nombreProducto} loading="lazy" onError={() => setError(true)} />
      ) : (
        <span>KULT</span>
      )}
    </div>
  )
}

export default function PedidoCard({ pedido }) {
  const estado = String(pedido.estado || 'PENDIENTE').toUpperCase()

  return (
    <article className="pedido-card">
      <header className="pedido-head">
        <div>
          <span className="mono pedido-numero">ORDEN #{String(pedido.idPedido).padStart(4, '0')}</span>
          <h2>{formatearFecha(pedido.fecha)}</h2>
        </div>
        <span className={`estado estado-${estado.toLowerCase()}`}>{estado}</span>
      </header>

      <div className="pedido-meta mono">
        <span>MEDIO DE PAGO: {pedido.medioPago || 'NO REGISTRADO'}</span>
        {pedido.fechaPago && <span>PAGO: {formatearFecha(pedido.fechaPago)}</span>}
      </div>

      <div className="pedido-items">
        {pedido.items.length === 0 ? (
          <p className="pedido-sin-items">Este pedido no tiene items registrados.</p>
        ) : pedido.items.map((item) => (
          <div className="pedido-item" key={`${pedido.idPedido}-${item.idVariante}`}>
            <ItemImagen item={item} />
            <div className="pedido-info">
              <h3>{item.nombreProducto}</h3>
              <p className="mono">
                {item.talla && `Talla: ${item.talla}`}
                {item.talla && item.color && ' · '}
                {item.color && `Color: ${item.color}`}
              </p>
              <p className="mono">Cantidad: {item.cantidad}</p>
            </div>
            <strong className="pedido-precio">{formatearPrecio(item.precioUnitario * item.cantidad)}</strong>
          </div>
        ))}
      </div>

      <footer className="pedido-totales">
        <div className="total-line"><span>SUBTOTAL</span><span>{formatearPrecio(pedido.subtotal)}</span></div>
        <div className="total-line"><span>COSTO DE ENVÍO</span><span>{formatearPrecio(pedido.costoEnvio)}</span></div>
        <div className="total-line final"><strong>TOTAL</strong><strong>{formatearPrecio(pedido.total)} COP</strong></div>
      </footer>
    </article>
  )
}
