import { Link } from 'react-router-dom'
import UsuarioEstado from './UsuarioEstado'

export default function TopBar({ backTo = '/', backLabel = '[VOLVER A LA TIENDA]', mostrarUsuario = false }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/registro">
        <img src="/img/recursospages/logokult.png" alt="Logo KULT Studio" style={{ height: '35px' }} />
        <span className="brand-text">
          <strong>KULT</strong>
          <small>STUDIO // LAB</small>
        </span>
      </Link>
      <div className="topbar-right">
        {mostrarUsuario && <UsuarioEstado />}
        <span className="currency">CUR: COP ($)</span>
        <Link className="back-link" to={backTo}>{backLabel}</Link>
      </div>
    </header>
  )
}
