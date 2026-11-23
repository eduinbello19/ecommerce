import { Link } from 'react-router-dom'

export default function ColeccionFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link className="brand" to="/coleccion">
              <b style={{ font: '800 1.2rem var(--display)' }}>KULT</b>
              <small>Studio</small>
            </Link>
            <p>Operando en la intersección del brutalismo subcultural, manipulación de serigrafía de alta densidad y cortes arquitectónicos pesados.</p>
            <div className="chips mono">
              <span>Certified 280GSM</span>
              <span>100% Organic</span>
            </div>
          </div>

          <div>
            <h4>Catálogo</h4>
            <ul>
              <li><Link to="/coleccion">Todas las prendas</Link></li>
              <li><a href="#catalogo">Nuevos lanzamientos</a></li>
              <li><Link to="/coleccion">Gráficos pesados</Link></li>
              <li><Link to="/coleccion">Boxy &amp; Oversized</Link></li>
              <li><Link to="/coleccion">Colección Permanente</Link></li>
            </ul>
          </div>

          <div>
            <h4>Atención al Cliente</h4>
            <ul>
              <li><Link to="/login">Rastreo de envíos</Link></li>
              <li><Link to="/registro">Membresía privada</Link></li>
              <li><Link to="/coleccion">Guía de tallas</Link></li>
              <li><a href="#catalogo">Envíos nacionales</a></li>
            </ul>
          </div>

          <div>
            <h4>Red Oficial</h4>
            <ul id="listadesp">
              <li><a href="#">INSTAGRAM <span>[EXT]</span></a></li>
              <li><a href="#">DISCORD ARCHIVE <span>[EXT]</span></a></li>
              <li><a href="#">SPOTIFY TRANSMISSIONS <span>[EXT]</span></a></li>
              <li><a href="#catalogo">Sede Bogotá // Medellín</a></li>
            </ul>
          </div>
        </div>

        <div className="fbot mono">
          <span className="l">© 2026 KULT STUDIO Inc. • Todos los derechos reservados • <b>Tienda oficial Colombia</b></span>
          <span className="pay">
            <span>🔒 Cifrado SSL 256-bit</span>
            <span>Wompi // PSE // Tarjetas</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
