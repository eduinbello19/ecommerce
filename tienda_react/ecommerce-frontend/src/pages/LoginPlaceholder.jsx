import { Link } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import Footer from '../components/layout/Footer'

export default function LoginPlaceholder() {
  return (
    <>
      <TopBar />
      <main className="layout">
        <section className="intro">
          <span className="tag"><i></i>ACCESO DE MIEMBROS</span>
          <h1>INICIAR SESIÓN</h1>
          <p className="subtitle">// MÓDULO EN CONSTRUCCIÓN</p>
          <p className="lead">
            Esta sección estará disponible cuando se conecte el endpoint de autenticación.
          </p>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2><i></i>ACCESO</h2>
            <span>[PRÓXIMAMENTE]</span>
          </div>
          <p className="login">
            ¿AÚN NO TIENES CUENTA? <Link to="/registro">[CREAR UNA AQUÍ]</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
