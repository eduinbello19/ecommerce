const ESPECIFICACIONES = [
  {
    titulo: 'Algodón 100% orgánico',
    texto: 'Tejido tubular de punto grueso hilado en anillos con acabado pre-encogido para garantizar que las dimensiones originales se mantengan idénticas.',
  },
  {
    titulo: 'Serigrafía puff & plastisol',
    texto: 'Proceso manual de serigrafía en talleres de Bogotá y Medellín. Tintas ecológicas con relieve 3D arquitectónico.',
  },
  {
    titulo: 'Corte oversized real',
    texto: 'Patrones no basados en agrandar tallas estándar. Silueta cuadrada boxy construida desde cero con hombros desplazados y cuello cerrado no deformable.',
  },
]

export default function Specs() {
  return (
    <div className="wrap">
      <div className="specs">
        {ESPECIFICACIONES.map((especificacion, indice) => (
          <article className="spec" key={especificacion.titulo}>
            <small className="mono">[Especificación 0{indice + 1}]</small>
            <h3>{especificacion.titulo}</h3>
            <p>{especificacion.texto}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
