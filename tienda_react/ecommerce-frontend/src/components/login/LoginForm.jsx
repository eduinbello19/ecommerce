import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validarCredenciales } from '../../services/authService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginForm({ onMessage }) {
  const navigate = useNavigate()
  const redirectTimer = useRef(null)
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [mantenerSesion, setMantenerSesion] = useState(true)
  const [mostrarClave, setMostrarClave] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(() => () => clearTimeout(redirectTimer.current), [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    clearTimeout(redirectTimer.current)
    redirectTimer.current = null

    if (!EMAIL_PATTERN.test(correo.trim())) {
      onMessage('Ingrese un correo válido', true)
      return
    }
    if (!clave) {
      onMessage('Ingrese su contraseña', true)
      return
    }

    setStatus('loading')
    onMessage('', false)

    try {
      await validarCredenciales({ correo: correo.trim(), claveHash: clave })
      onMessage('bienvenid@ a su cuenta', false)
      redirectTimer.current = setTimeout(() => navigate('/coleccion', { replace: true }), 3000)
    } catch (error) {
      onMessage(error.message, true)
    } finally {
      setStatus('idle')
    }
  }

  return (
    <section className="tarjeta">
      <header>
        <h3>TERMINAL // KULT-ID 2.4.9</h3>
        <nav>
          <i></i>
          <i></i>
          <i className="activo"></i>
        </nav>
      </header>

      <form className="login-form" noValidate onSubmit={handleSubmit}>
        <div>
          <header>
            <label htmlFor="correo-electronico">IDENTIFICADOR / CORREO ELECTRÓNICO</label>
            <small>[COLOMBIA REG.]</small>
          </header>
          <div className="entrada">
            <b>@</b>
            <input
              id="correo-electronico"
              name="correo_electronico"
              type="email"
              autoComplete="email"
              placeholder="usuario@correo.co"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
            />
          </div>
        </div>

        <div>
          <header>
            <label htmlFor="contrasena-cifrada">CONTRASEÑA CIFRADA</label>
            <a href="#">¿OLVIDASTE TU CONTRASEÑA? <mark className="resaltado">[RECUPERAR CLAVE]</mark></a>
          </header>
          <div className="entrada">
            <b aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="10" width="16" height="11" rx="1" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </b>
            <input
              id="contrasena-cifrada"
              name="contrasena"
              type={mostrarClave ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={clave}
              onChange={(event) => setClave(event.target.value)}
            />
            <button
              type="button"
              className="eye-button"
              aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setMostrarClave((valor) => !valor)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="remember-row">
          <input
            type="checkbox"
            id="mantener-sesion"
            name="mantener_sesion"
            checked={mantenerSesion}
            onChange={(event) => setMantenerSesion(event.target.checked)}
          />
          <label htmlFor="mantener-sesion">MANTENER SESIÓN ACTIVA EN ESTE DISPOSITIVO SEGURO</label>
        </div>

        <button type="submit" className="boton" disabled={status === 'loading'}>
          {status === 'loading' ? 'VALIDANDO CREDENCIALES...' : 'INGRESAR A MI CUENTA →'}
        </button>

        <p className="divisor">---------| O CONTINUAR CON |---------</p>

        <fieldset>
          <button type="button" className="boton social">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.76-1.95 3.08-3.74 3.08-2.27 0-4.11-1.84-4.11-4.11s1.84-4.11 4.11-4.11c1.04 0 1.99.38 2.73 1.01l2.04-2.04C17.65 6.69 15.5 5.8 12.18 5.8 7.66 5.8 4 9.46 4 13.98s3.66 8.18 8.18 8.18c4.73 0 7.86-3.32 7.86-7.99 0-.55-.06-1.07-.17-1.57z" />
            </svg>
            GOOGLE // OAUTH
          </button>
          <button type="button" className="boton social">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.04 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.83 5.42c.57-.69.96-1.65.85-2.61-.84.04-1.87.56-2.45 1.25-.53.62-.99 1.61-.87 2.56.94.07 1.9-.49 2.47-1.2z" />
            </svg>
            APPLE // CONNECT
          </button>
        </fieldset>
      </form>

      <article className="tarjeta secundaria">
        <header>
          <h4>¿AÚN NO TIENES IDENTIFICADOR?</h4>
          <p>Apertura de fichas sujeta a disponibilidad de cupos en Colombia.</p>
        </header>
        <Link to="/registro">[CREAR CUENTA NUEVA]</Link>
      </article>
    </section>
  )
}
