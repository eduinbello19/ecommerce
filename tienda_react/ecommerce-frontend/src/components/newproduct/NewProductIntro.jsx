export default function NewProductIntro() {
  return (
    <section className="intro">
      <span className="tag"><i></i>INVENTARIO KULT // PROTOCOLO SS25-04</span>
      <h1>REGISTRO DE PRODUCTO</h1>
      <p className="subtitle">// ALTA Y EDICIÓN DE CATÁLOGO</p>
      <p className="lead">
        Configura la categoría, la ficha técnica y las variantes de tallaje de las prendas
        que van a lanzarse en tienda. Cada cambio se publica de inmediato en la colección.
      </p>

      <figure className="preview">
        <img src="/img/colection/buso_negro_neon.jpg" alt="Prenda KULT Studio lista para catálogo" />
        <figcaption>
          <div>
            <span>CATÁLOGO TÉCNICO // DROP 04</span>
            <span>ALGODÓN ORGÁNICO // SERIGRAFÍA NEÓN</span>
          </div>
          <b>[STOCK LAB]</b>
        </figcaption>
      </figure>

      <div className="quota">
        <div className="quota-head">
          <span>ESTADO DE PUBLICACIÓN</span>
          <b>SINCRONIZADO</b>
        </div>
        <div className="quota-bar"><i style={{ width: '100%' }} /></div>
        <p className="quota-note">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>CAMBIOS EN VIVO EN /COLECCIÓN // SISTEMA V.4.02</span>
        </p>
      </div>
    </section>
  )
}
