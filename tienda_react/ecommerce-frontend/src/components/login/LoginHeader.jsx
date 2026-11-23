import { Link } from 'react-router-dom'
import logo from '../../assets/logokult.png'

export default function LoginHeader({ message, isError }) {
  return (
    <header className="login-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="Logo KULT Studio" style={{ height: '35px' }} />
        <h1>KULT</h1>
        <small>STUDIO // LAB</small>
      </div>
      <p id="saludokult" data-error={isError ? 'true' : 'false'}>{message}</p>
      <nav>
        <small>CUR: COP ($)</small>
        <Link to="/">[VOLVER A LA TIENDA]</Link>
      </nav>
    </header>
  )
}
