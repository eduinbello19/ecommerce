import { useState } from 'react'
import { colorSwatch, estadoStock, formatearPrecio, normalizarRutaImagen, obtenerVariantePorTalla } from '../../utils/catalogo'

export default function ProductCard({ producto, categoria, variantes, tallaSeleccionada, numero, onComprar }) {
  const [imagenError, setImagenError] = useState(false)
  const variante = obtenerVariantePorTalla(variantes, tallaSeleccionada)
  const stock = Number(variante?.stock || 0)
  const estado = estadoStock(stock)
  const rutaImagen = normalizarRutaImagen(producto.rutaImagen)
  const colores = [...new Set(variantes.map((item) => item.color).filter(Boolean))].slice(0, 2)

  const textoBoton = estado === 'agotado' ? 'Agotado' : 'Comprar'
  const textoBadge = estado === 'agotado' ? 'Agotado' : estado === 'ultimas' ? 'Últimas unidades' : 'Nuevo drop'
  const claseBadge = estado === 'ultimas' ? 'bdg r mono' : estado === 'agotado' ? 'bdg d mono' : 'bdg mono'

  return (
    <article className={`card ${estado === 'agotado' ? 'card-agotado' : ''}`}>
      <div className={`img ${producto.rutaImagen?.includes('blanca') ? 'white' : ''}`}>
        {rutaImagen && !imagenError ? (
          <img src={rutaImagen} alt={producto.nombre} loading="lazy" onError={() => setImagenError(true)} />
        ) : (
          <span className="ph" />
        )}
        <span className="code mono">KULT // SS25-{String(numero).padStart(2, '0')}</span>
        <span className={claseBadge}>{textoBadge}</span>
      </div>

      <div className="body">
        <div className="meta mono">
          <b>{categoria?.nombre || 'KULT STUDIO'} - {producto.gramajeGsm} GSM</b>
          <span>
            {colores.map((color, indice) => (
              <i
                key={color}
                className={indice === 1 ? 'w' : ''}
                style={{ background: colorSwatch(color), borderColor: colorSwatch(color) }}
              />
            ))}
          </span>
        </div>
        <h3>{producto.nombre}</h3>
        <p>{categoria?.descripcion || 'Prenda KULT Studio de producción limitada.'}</p>
        <div className="buy">
          <strong>{formatearPrecio(producto.precio)}<br />COP</strong>
          <button
            type="button"
            className="btn lime"
            disabled={estado === 'agotado'}
            onClick={() => onComprar(producto, variante)}
          >
            {textoBoton} <span>→</span>
          </button>
        </div>
      </div>
    </article>
  )
}
