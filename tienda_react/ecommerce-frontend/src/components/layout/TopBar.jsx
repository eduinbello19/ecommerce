import { Link } from 'react-router-dom'
import logo from '../../assets/logokult.png'

export default function TopBar() {
  return (
    <header className="topbar">
      <Link className="brand" to="/registro">
        <img src={logo} alt="Logo KULT Studio" style={{ height: '35px' }} />
        <span className="brand-text">
          <strong>KULT</strong>
          <small>STUDIO // LAB</small>
        </span>
      </Link>
      <div className="topbar-right">
        <span className="currency">CUR: COP ($)</span>
        <Link className="back-link" to="/">[VOLVER A LA TIENDA]</Link>
      </div>
    </header>
  )
}
