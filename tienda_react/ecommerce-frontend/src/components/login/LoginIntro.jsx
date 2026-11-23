import merchImg from '../../assets/imgloginmerch.jpg'

export default function LoginIntro() {
  return (
    <section className="tarjeta">
      <header>
        <p className="resaltado">■ FASE // 04 • AUTH GATEWAY</p>
        <p>BOG // MDE</p>
      </header>

      <div>
        <small className="resaltado">PROTOCOLO DE ACCESO // MIEMBROS KULT</small>
        <h2>INICIAR SESIÓN EN KULT STUDIO</h2>
      </div>

      <p>
        Identificación requerida para consultar tus compras y pedidos, seriales adquiridos
        y activaciones clandestinas en Colombia.
      </p>

      <figure className="tarjeta">
        <img src={merchImg} alt="Colección oficial KULT Studio" />
        <figcaption>COLECCIÓN OFICIAL // 2024.BOG</figcaption>
      </figure>

      <article className="tarjeta">
        <h3>BENEFICIOS DE IDENTIFICACIÓN</h3>
        <ol>
          <li><mark className="resaltado">01.</mark> Acceso prioritario 15 min antes a Drops limitados y cápsulas secretas.</li>
          <li><mark className="resaltado">02.</mark> Historial de pedidos con rastreo sincronizado (Servientrega & Coordinadora).</li>
          <li><mark className="resaltado">03.</mark> Libreta de direcciones urbanas guardadas en Colombia (BOG, MDE, CLO, BAQ).</li>
          <li><mark className="resaltado">04.</mark> Descarga libre de publicaciones, fanzines digitales y stems de audio KULT.</li>
        </ol>
      </article>
      <article className="tarjeta secundaria">
        <p>ESTADO DE NODO</p>
        <p>PROTOCOLO DE ACCESO // MIEMBROS KULT</p>
        <mark className="resaltado">● ONLINE (BOG-01)</mark>
      </article>
    </section>
  )
}
